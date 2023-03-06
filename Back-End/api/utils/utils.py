import requests

token = ''
headers = {
    'Authorization':'Bearer '+token,
    'Accept': 'application/vnd.github+json'    
}
url = 'https://api.github.com/repos/CS532-Spring23-Course-Registration/CS_532_Course_Registration/codespaces/secrets'
print(url)

data = requests.get(url, headers=headers)

print(data.json())