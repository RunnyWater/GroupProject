let history_opened = false;

document.addEventListener('DOMContentLoaded', function() {
    fetch('/check_login')
        .then(response => response.text())
        .then(data => {
            if(data === '0'){
                document.getElementById('login_button').style.display= 'flex';
            }else{
                document.getElementById('login_button').style.display= 'none';
                document.getElementById('user_logged_in').innerHTML = `<img src="images/user_logged_in.png" class="icon__logout">
                <span style="padding-left: 5px;" id="user_name"><button class="log_out__button" id="log_out">${data}</button></span>`
                document.getElementById('log_out').addEventListener('click', function() {


                    if(confirm("Are you sure you want to log out?")){
                        logout()
                    }else{
                        
                    }
                    
                    function logout() {
                        // Make a request to the server's logout endpoint
                        fetch('/logout', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            // Redirect the user to the login page or homepage
                            window.location.href = '/login'; // Adjust the URL as necessary
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });
                    }

                })

            }})
        .catch((error) => {
            console.error('Error getting the response:', error);
        })
});



document.getElementById('showHistoryButton').addEventListener('click', function() {
    const historyList = document.getElementById('historyList');
    historyList.style.display = 'block';
    const hideHistoryButton = document.createElement('button');
    hideHistoryButton.id = 'hideHistoryButton';
    hideHistoryButton.className = 'title__general';
    hideHistoryButton.textContent = "⤬";
    hideHistoryButton.addEventListener('click', hideHistory);
    document.getElementById('historyContainer').appendChild(hideHistoryButton);
    setTimeout(function() {
        hideHistoryButton.style.opacity = '1'; 
    }, 10); // Delay in milliseconds
    // console.log("ebat")
    if (!history_opened) {

        fetch('/get_history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data === 0) {
                document.getElementById('history_label').innerHTML = "Please log in";
                return;
            }
            let questionHistoryHtml = '';
            data.forEach(item => {
                questionHistoryHtml += `<li class="history__items" ><button class="history__button" id="${item}">${item}</button></li>`;
            });
            history_opened = true;

            let history = document.getElementById('question__div');
            history.innerHTML += questionHistoryHtml;
            data.forEach(item => {
                document.getElementById(item).addEventListener('click', function() {        
                    fetch('/get_answer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ question: item}),
                    })
                    .then(response => response.json())
                    .then(data => {
                        let [text, answerElementValue, randomFactValue] = data;
                        
                        document.getElementById('ai_user_search').innerText = text;
                        // delete_textarea();
                        document.getElementById('ai__search').style.display = "none";
                        document.getElementById('ai__answer').innerText = answerElementValue;
                        document.getElementById('ai_answer_list').style.display = "block";
                        // RANDOM FACT
                        document.getElementById('random__fact__label').style.display = "block";
                        document.getElementById('random__fact').innerText = randomFactValue;
                        
                                })
                    .catch((error) => {
                        console.error('Error getting the response:', error);
                    })

                })
            })


        })
        .catch((error) => {
            console.error('Error getting the response:', error);
        });}
    

    
    

  
    function hideHistory() {
        const historyList = document.getElementById('historyList');
        historyList.style.display = 'none';

        const hideHistoryButton = document.getElementById('hideHistoryButton');
        hideHistoryButton.parentNode.removeChild(hideHistoryButton);
    }
});

document.getElementById('ai_update').addEventListener('click', function() {
    const textarea = document.getElementById('multilineInput');
    const text = textarea.value; 

    fetch('/ai_update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responseText: text}),
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('ai__answer').innerText = data;

    })
    .catch((error) => {
        console.error('Error updating the response:', error);
    })});



document.addEventListener('DOMContentLoaded', function() {
    const multilineInput = document.getElementById('multilineInput');

    // Function to adjust the height of the textarea
    function autoResize() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px'; 
    }

    multilineInput.addEventListener('input', autoResize);

    autoResize.call(multilineInput);
});


document.addEventListener('DOMContentLoaded', function() {
    const multilineInput = document.getElementById('multilineInput');
    const charCount = document.getElementById('charCount');

    // Function to update the character count
    function updateCharCount() {
        const charCountValue = multilineInput.value.length;
        if (charCountValue >= 300) {
            charCount.textContent = charCountValue + ' / 500';
            charCount.style.display = 'block'; 
        } else {
            charCount.style.display = 'none'; 
        }
    }


    multilineInput.addEventListener('input', updateCharCount);



    updateCharCount();
});

document.getElementById('ai_submit').addEventListener('click', function() {
    const textarea = document.getElementById('multilineInput');
    const text = textarea.value; 
    

    if (text === '') {
        alert('Please enter text in the textarea');
        return;
    } else {
        fetch('/ai_answer', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ aiInput: text}),


        })
        .then(response => response.json())
        .then(data => {
            let [answerElementValue, randomFactValue] = data;
            document.getElementById('ai_user_search').innerText = text;
            // delete_textarea();
            document.getElementById('ai__search').style.display = 'none';

            document.getElementById('ai__answer').innerText = answerElementValue;
            document.getElementById('ai_answer_list').style.display = "block";
            // RANDOM FACT
            document.getElementById('random__fact__label').style.display = "block";
            document.getElementById('random__fact').innerText = randomFactValue;
            document.getElementById('ai_update').addEventListener('click', function() {
                fetch('/ai_update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({responseText: text}),

                })
                .then(response => response.text())
                .then(data => {
                    document.getElementById('ai__answer').innerText = data;
            
                })
                .catch((error) => {
                    console.error('Error updating the response:', error);
                })});   

        })
        .catch((error) => {
            console.error('Error getting the response:', error);
        });       
    }

});
