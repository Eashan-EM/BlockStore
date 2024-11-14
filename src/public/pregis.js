const p_name = document.querySelector('#p-name')
const p_email = document.querySelector('#p-email')
const p_phno = document.querySelector('#p-phno')
const p_pwd = document.querySelector('#p-pwd')
// const p_bg = document.querySelector('#p-bg')
// const p_age = document.querySelector('#p-age')
// const p_gender = document.querySelector('#p-gender')
const p_btn = document.querySelector('#p-register')
const showkey = document.querySelector('.showkey')

p_btn.addEventListener('click', () => {
    // if(h_name.value == '' || h_email.value == '' || h_phno.name == '' || h_pwd.value == '') return alert('Please Enter all The Details!')
    // else {
        fetch('/registerKey', ({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: p_name.value,
                email: p_email.value,
                phno: p_phno.value,
                pwd: p_pwd.value,
                // bg: p_bg.value,
                // age: p_bg.value,
                // gender: p_gender.value
            })
        }))
        .then(res => res.json())
        .then(data => {
            showkey.style.display = 'block'
            showkey.innerHTML = `<pre>IMPORTANT: Your HashKey is \n${data.pr}\n Store this in a safe place.</pre>`
        })
    // }
})
