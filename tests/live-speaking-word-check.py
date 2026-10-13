"""Public Higgs samples only. Live service integration, not child accuracy evidence."""
import json
import urllib.request
from pathlib import Path
ENDPOINT='https://toy-buddy-speech.hiei1121.workers.dev/api/speaking-check'
samples=[
 ('gg-word','girl','girl','assets/unit3/lesson3/audio/girl.mp3','CORRECT'),
 ('gg-word','guitar','guitar','assets/unit3/lesson3/audio/guitar.mp3','CORRECT'),
 ('toy-word','robot','robot','assets/unit3/audio/robot.mp3','CORRECT'),
 ('name','robot','robot','assets/unit3/audio/robot.mp3','INCOMPLETE'),
 ('yes-no','robot','robot','assets/unit3/lesson2/audio/answers/yes_it_is.mp3','CORRECT'),
]
results=[]
for task,question,shown,path,expected in samples:
 boundary='----ToyWordCheck313'
 body=b''
 for field,value in [('questionType',task),('questionToy',question),('displayedToy',shown)]:
  body+=f'--{boundary}\r\nContent-Disposition: form-data; name="{field}"\r\n\r\n{value}\r\n'.encode()
 body+=f'--{boundary}\r\nContent-Disposition: form-data; name="audio"; filename="sample.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode()+Path(path).read_bytes()+f'\r\n--{boundary}--\r\n'.encode()
 request=urllib.request.Request(ENDPOINT,data=body,headers={'Origin':'https://dodinhhieu2207.github.io','Content-Type':f'multipart/form-data; boundary={boundary}','User-Agent':'Mozilla/5.0 ToyBuddyIntegrationCheck/1.0'})
 with urllib.request.urlopen(request,timeout=30) as response:
  result=json.load(response)
 row={'task':task,'sample':path,'expected':expected,'response':result}
 results.append(row);print(json.dumps(row,ensure_ascii=True))
 assert result['result']==expected, row
Path('tests/live-speaking-word-results.json').write_text(json.dumps({'purpose':'Live public synthetic Higgs samples; does not measure child speech accuracy','endpoint':ENDPOINT,'results':results},indent=2),encoding='utf-8')
print('PASS live Worker: both Gg words, toy word, strict full-name sentence, yes/no sentence.')
