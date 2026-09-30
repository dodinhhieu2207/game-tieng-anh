import {allowedOrigin} from '../mock-core.mjs';
import {scoreSpeechPayload} from '../speech-service.mjs';

export default async function handler(req,res){
  const origin=String(req.headers.origin||'');
  res.setHeader('Access-Control-Allow-Origin',allowedOrigin(origin));
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({error:'method_not_allowed'});
  const payload=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
  if(JSON.stringify(payload).length>2800000)return res.status(413).json({error:'audio_too_large'});
  if(!payload.test&&!payload.target)return res.status(400).json({error:'target_required'});
  return res.status(200).json(await scoreSpeechPayload(payload));
}
