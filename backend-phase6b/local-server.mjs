import http from 'node:http';
import {allowedOrigin} from './mock-core.mjs';
import {scoreSpeechPayload} from './speech-service.mjs';

const port=Number(process.env.PORT)||8787;
const server=http.createServer((req,res)=>{
  const origin=String(req.headers.origin||'');
  res.setHeader('Access-Control-Allow-Origin',allowedOrigin(origin));
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store');
  if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
  if(req.url!=='/api/speech-score'){res.writeHead(404,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'not_found'}));}
  if(req.method!=='POST'){res.writeHead(405,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'method_not_allowed'}));}
  let raw='';
  req.on('data',chunk=>{raw+=chunk;if(raw.length>2800000)req.destroy();});
  req.on('end',async()=>{
    try{
      const payload=JSON.parse(raw||'{}');
      if(!payload.test&&!payload.target){res.writeHead(400,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'target_required'}));}
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify(await scoreSpeechPayload(payload)));
    }catch(error){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'invalid_json',detail:error.message}));}
  });
});
server.listen(port,'127.0.0.1',()=>console.log(`Ellie Phase 6B speech backend: http://127.0.0.1:${port}/api/speech-score`));
