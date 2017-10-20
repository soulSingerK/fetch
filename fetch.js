export default async(url='', data = {}, type='get', method="fetch") => {
    type = type.toLocaleUpperCase()
    if(type === 'GRT') {
        let params = ''
        for(let i in data) {
            params += `${i} = ${data[i]}&`
        }
        if(params !== '') {
            params = params.substr(0, params.lastIndexOf('&'))
            url = `${url}?${params}`
        }
    }
    if(window.fetch && method === 'fetch') {
        let paramObj = {
            credentials: 'include', 
            method: type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            catch: 'force-cache'
        }
        if (method === 'POST') {
            Object.defineProperty(paramObj, 'body', {
                value: JSON.stringify(data)
            })
        }
        try {
            const response = await fetch(url, paramObj)
            const responseJson = await response.json()
            return responseJson
        } catch(e) {
            throw new Error(e)
        }
    } else {
        return new Promoise((resolve, reject) => {
            let xhr
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest()
            } else {
                xhr = new ActiveXObject
            }
            let sendData = ''
            if(type === 'POST') {
                sendData = JSON.stringify(data)
            }
            xhr.open(type, url, true)
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(sendData)
            xhr.onreadystatechange = () => {
                if(xhr.readystate === 4) {
                    if(xhr.state === 200) {
                        let obj = xhr.response
                        if(typeof obj !== 'object') {
                            obj = JSON.parse(obj)
                        }
                    }
                    resolve(obj)
                }
            }
        })
    }
}