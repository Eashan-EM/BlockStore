const h_key = document.querySelector('#h-key')
const p_key = document.querySelector('#p-key')
const h_login = document.querySelector('#h-login')
const p_login = document.querySelector('#p-login')

if(sessionStorage.getItem("user_type") === null) sessionStorage.setItem("user_type", "")
// if(sessionStorage.getItem("user_type") == "") return

h_login.addEventListener('click', () => {
   if(h_key.value == "") return alert("Please Enter The HashKey.")
    
        fetch('/login-hospital', ({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                id: h_key.value
            })
        })).then(res => res.json())
    
})

p_login.addEventListener('click', () => {
    if(p_key.value == "") return alert("Please Enter The HashKey.")
    fetch('/login-patient', ({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            id: p_key.value
        })
    }))
})
