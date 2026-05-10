import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────
const T = {
  bg:"#FDF8F5", bg2:"#FAF3EE",
  surface:"rgba(255,255,255,0.85)", border:"rgba(196,120,106,0.18)",
  cream:"#3D2B22", creamSub:"rgba(61,43,34,0.7)", creamMute:"rgba(61,43,34,0.4)",
  rose:"#C4786A", roseDeep:"#9E5246",
  gold:"#B8884A", goldSoft:"#D4A96A",
  sage:"#5C8A74", lavender:"#7B6FA0",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{background:${T.bg};min-height:100vh;overscroll-behavior:none}
  ::-webkit-scrollbar{width:2px}
  ::-webkit-scrollbar-thumb{background:rgba(196,120,106,0.3);border-radius:2px}
  textarea,input,select{outline:none;font-family:'EB Garamond',serif;background:none;color:${T.cream}}
  textarea::placeholder,input::placeholder{color:${T.creamMute}}
  select option{background:#FDF8F5;color:${T.cream}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes cardIn{from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
  .fade-up{animation:fadeUp 0.5s ease both}
  .fade-in{animation:fadeIn 0.4s ease both}
  .float{animation:float 3.5s ease-in-out infinite}
  .card-in{animation:cardIn 0.45s ease both}
`;

// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────
function useStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  const save = useCallback((v) => {
    setVal(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [val, save];
}

// ─────────────────────────────────────────────────────────────
// AI CALL
// ─────────────────────────────────────────────────────────────
async function askClaude(system, user, maxTokens = 400) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system,
      messages:[{role:"user", content:user}],
    }),
  });
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ─────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────
const MOON_PHASES = [
  { name:"New Moon",        icon:"🌑", energy:"Planting seeds",    ritual:"Write your deepest intention and seal it with breath." },
  { name:"Waxing Crescent", icon:"🌒", energy:"Building momentum", ritual:"Take one small action toward what you are calling in." },
  { name:"First Quarter",   icon:"🌓", energy:"Decisive action",   ritual:"Name the resistance and walk through it anyway." },
  { name:"Waxing Gibbous",  icon:"🌔", energy:"Refining",          ritual:"Adjust one thing. Trust is the practice." },
  { name:"Full Moon",       icon:"🌕", energy:"Releasing",         ritual:"Write what you are releasing. Read it aloud. Let it go." },
  { name:"Waning Gibbous",  icon:"🌖", energy:"Gratitude",         ritual:"Name three things that arrived this cycle." },
  { name:"Last Quarter",    icon:"🌗", energy:"Letting go",        ritual:"What are you finally ready to stop carrying?" },
  { name:"Waning Crescent", icon:"🌘", energy:"Rest & receive",    ritual:"Do nothing sacred today. Rest IS the ritual." },
];
function getMoonPhase() {
  const days = (new Date() - new Date("2000-01-06")) / 86400000;
  return MOON_PHASES[Math.floor(((days % 29.53) / 29.53) * 8) % 8];
}

const AFFIRMATIONS = [
  "I am allowed to take up space.",
  "My healing is happening, even when I cannot see it.",
  "I release what no longer serves my becoming.",
  "I am the answer to my ancestors' prayers.",
  "I trust the unfolding of my life.",
  "My worth is not earned. It is inherent.",
  "I receive love as easily as I give it.",
  "I am rooted enough to bend without breaking.",
  "Today I choose myself, tenderly and without apology.",
  "I am becoming. This is enough.",
  "The sacred lives inside me. I carry it everywhere.",
  "I am not behind. I am in my exact season.",
];

const BLOOM_STAGES = [
  { stage:"Seed",    icon:"🌱", desc:"Resting in sacred stillness. Your roots are forming." },
  { stage:"Sprout",  icon:"🌿", desc:"Something tender is emerging. Protect it." },
  { stage:"Bud",     icon:"🌼", desc:"You are on the edge of opening. Trust the timing." },
  { stage:"Bloom",   icon:"🌸", desc:"In full expression. You are becoming what you were meant to be." },
  { stage:"Radiant", icon:"🌺", desc:"Fully alive. Sharing your light with the world." },
];

const ORACLE_CARDS = [
  { title:"The Becoming",             symbol:"🌱", color:T.sage,     message:"You are not behind. You are in the exact season your becoming requires. Stop measuring your bloom against someone else's summer." },
  { title:"The Wound That Opened You",symbol:"🌹", color:T.rose,     message:"What broke you open was not a mistake. It was an initiation. The woman standing in the aftermath is the miracle." },
  { title:"Sovereign",                symbol:"👑", color:T.gold,     message:"You do not need permission to take up space. Your presence is not too much. It is exactly enough." },
  { title:"The Unbecoming",           symbol:"🦋", color:T.lavender, message:"Before you bloom, something must die. Let the old version go with grace. She served her purpose." },
  { title:"Rooted",                   symbol:"🌿", color:T.sage,     message:"Your healing is not fragile. It has roots now. Even the storms cannot uproot what has grown this deep." },
  { title:"Receive",                  symbol:"🌊", color:"#7EB7C4",  message:"You are so practiced at giving. But the universe needs somewhere to land. Open your hands. Learn to receive." },
  { title:"The Sacred No",            symbol:"🔥", color:T.roseDeep, message:"Every no that honors you is a yes to something holy. You are allowed to choose yourself, every single time." },
  { title:"Ancestors",                symbol:"✨", color:T.goldSoft, message:"You carry the prayers of women who came before you. They survived so you could bloom. Their strength lives in your bones." },
  { title:"The Still Small Voice",    symbol:"🕊️", color:T.creamSub, message:"The answer you are searching for is already inside you. Be still long enough to hear her. She has been speaking." },
  { title:"Cycle",                    symbol:"🌙", color:T.lavender, message:"You are not broken for having seasons. Even the moon knows how to disappear and return whole." },
  { title:"Worth",                    symbol:"💎", color:"#85B4D4",  message:"Your worth was never something to earn. It was woven into you before you took your first breath. Come home to yourself." },
  { title:"The Long Way",             symbol:"🗺️", color:T.gold,     message:"The path that looks like a detour is often the path. Every mile has made you who you needed to become." },
];

const DREAM_SYMBOLS = {
  water:"Emotions, the unconscious, flow. Deep water = depth of feeling; stormy water = unresolved emotion.",
  fire:"Passion, transformation, purification. Often signals intense emotion or a powerful cleansing.",
  flying:"Freedom, spiritual elevation, a desire to rise above a situation.",
  falling:"Loss of control, or releasing something you have been gripping too tightly.",
  house:"Your self, your psyche. Each room represents a different aspect of who you are.",
  snake:"Transformation, healing, hidden wisdom. The snake sheds its skin — so might you.",
  door:"Opportunity, transition, choice. Open = invitation; locked = boundary to examine.",
  baby:"New beginnings, vulnerability, a project or part of yourself in early stages.",
  death:"Transformation and endings — not literal. Something completing so something new can begin.",
  light:"Clarity, divine guidance, hope, revelation.",
  forest:"The unconscious, mystery. Are you lost or exploring?",
  ocean:"The vast unconscious, spiritual depth. What was the ocean doing?",
};

const JOURNAL_THEMES = [
  { label:"New Moon Intentions",   icon:"🌑", color:T.lavender },
  { label:"Releasing & Letting Go",icon:"🍂", color:T.roseDeep },
  { label:"Gratitude Portal",      icon:"✨", color:T.gold },
  { label:"Shadow Work",           icon:"🌒", color:"#8B6A8B" },
  { label:"Love Letter to Self",   icon:"💌", color:T.rose },
  { label:"Ancestral Healing",     icon:"🌿", color:T.sage },
  { label:"Dream Reflection",      icon:"🌙", color:T.lavender },
  { label:"Future Self",           icon:"🔮", color:T.goldSoft },
];

const STORY_THEMES = ["Healing","Becoming","Releasing","Gratitude","Boundaries","Love","Ancestors","Shadow"];
const SEED_STORIES = [
  { id:1, theme:"Healing",   title:"I stopped apologizing for my tears",   body:"For 34 years I thought crying made me weak. This year I finally understood — I was not weak. I was alive.", initials:"M", moon:"Full Moon" },
  { id:2, theme:"Becoming",  title:"The version of me she needed",          body:"My daughter asked me why I always put myself last. I didn't have an answer. That question changed everything.", initials:"T", moon:"New Moon" },
  { id:3, theme:"Releasing", title:"I left the room and never went back",   body:"Not the building. Not the relationship. The version of me who believed she had to stay to be loved.", initials:"J", moon:"Waning Crescent" },
  { id:4, theme:"Boundaries","title":"No is a complete sentence",           body:"I said it without an explanation for the first time. My hands were shaking. But I said it.", initials:"A", moon:"First Quarter" },
  { id:5, theme:"Ancestors", title:"She survived so I could bloom",         body:"I found my great-grandmother's photo. She was looking at the camera like she knew I would find her one day.", initials:"R", moon:"Waxing Gibbous" },
];

// Numerology
const LIFE_PATHS = {
  1:  { keyword:"The Pioneer",         gift:"Natural-born leader — fierce, independent, and the courage to forge new paths.",       shadow:"Can slip into ego or isolation. Strength and vulnerability can coexist.",         affirmation:"I lead with courage and I trust my own vision." },
  2:  { keyword:"The Peacemaker",      gift:"Deeply intuitive, empathetic, and gifted at seeing all sides of every story.",         shadow:"Prone to losing yourself in others' needs. Your own feelings are sacred too.",    affirmation:"I honor my sensitivity as the strength it truly is." },
  3:  { keyword:"The Creative",        gift:"A wellspring of joy, creativity, and expressive power. You light up rooms.",           shadow:"Scattered energy or self-doubt can dim your light. Channel it — don't suppress it.", affirmation:"My voice and my art are medicine for the world." },
  4:  { keyword:"The Builder",         gift:"Patient, disciplined, and gifted at creating lasting foundations.",                    shadow:"Rigidity can block growth. Not everything sacred looks like a plan.",            affirmation:"I build with intention and I trust the process." },
  5:  { keyword:"The Freedom Seeker",  gift:"Adventurous, magnetic, born to experience the full spectrum of life.",                 shadow:"Restlessness or fear of commitment. You can be rooted and free at the same time.", affirmation:"I embrace change as my greatest teacher." },
  6:  { keyword:"The Nurturer",        gift:"A natural healer and harmonizer. People feel safe in your presence.",                  shadow:"Martyrdom or over-giving. You cannot pour from empty. Receive.",                affirmation:"I care for others and I care for myself with equal devotion." },
  7:  { keyword:"The Seeker",          gift:"Deeply spiritual, analytical, called to understand life's deeper mysteries.",          shadow:"Isolation or spiritual bypassing. The sacred also lives in connection.",          affirmation:"I trust my inner knowing. I am guided." },
  8:  { keyword:"The Manifester",      gift:"Powerful, ambitious, built to create material and spiritual abundance.",               shadow:"Power struggles or fear of losing control. True power flows — it does not grip.", affirmation:"I step into my power with grace and integrity." },
  9:  { keyword:"The Humanitarian",    gift:"Compassionate, wise, and here to serve humanity's healing.",                          shadow:"Difficulty letting go of people, pain, or the past. Completion is sacred.",      affirmation:"I release what is complete and I trust the new beginning." },
  11: { keyword:"The Intuitive ✦",     gift:"Master number — deeply psychic, visionary, here to inspire at a soul level.",         shadow:"Anxiety from absorbing others' energy. Ground yourself daily.",                 affirmation:"I am a channel for higher wisdom. I am protected and guided." },
  22: { keyword:"The Master Builder ✦",gift:"Master number — here to build something that outlasts you and serves the collective.", shadow:"Pressure from your own potential can cause paralysis. Start small.",            affirmation:"I build my vision one sacred step at a time." },
  33: { keyword:"The Master Teacher ✦",gift:"Master number — rare embodiment of unconditional love and healing wisdom.",           shadow:"Self-sacrifice to depletion. You cannot teach from an empty well.",             affirmation:"I teach what I have lived, and I live what I teach." },
};
function calcLifePath(dob) {
  const digits = dob.replace(/-/g,"").split("").map(Number);
  let s = digits.reduce((a,b)=>a+b,0);
  while (s > 9 && s !== 11 && s !== 22 && s !== 33) s = String(s).split("").map(Number).reduce((a,b)=>a+b,0);
  return s;
}

// Astrology
const ALL_SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGN_GLYPHS = {Aries:"♈",Taurus:"♉",Gemini:"♊",Cancer:"♋",Leo:"♌",Virgo:"♍",Libra:"♎",Scorpio:"♏",Sagittarius:"♐",Capricorn:"♑",Aquarius:"♒",Pisces:"♓"};

// Human Design
const HD_TYPES = {
  "Manifestor":           { aura:"Closed & Repelling",    strategy:"Inform before acting",              desc:"Here to initiate and create impact. You spark movements that others build on." },
  "Generator":            { aura:"Open & Enveloping",     strategy:"Wait to respond",                   desc:"Here to master what lights you up. Your consistent, magnetic energy sustains the world." },
  "Manifesting Generator":{ aura:"Open & Enveloping",     strategy:"Wait to respond, then inform",      desc:"Multi-passionate and fast-moving. You're here to master multiple paths at once." },
  "Projector":            { aura:"Focused & Absorbing",   strategy:"Wait for the invitation",           desc:"Here to guide, direct, and see others. Your wisdom is the gift — when invited." },
  "Reflector":            { aura:"Sampling & Resistant",  strategy:"Wait 28 days before big decisions", desc:"Here to reflect the health of your community. Rare, wise, and deeply lunar." },
};
const HD_PROFILES = {
  "1/3":"Investigator/Martyr — Foundation through lived experience. You learn by doing and sometimes failing, and your wisdom is real.",
  "1/4":"Investigator/Opportunist — Your secure foundation of knowledge serves the people already in your life.",
  "2/4":"Hermit/Opportunist — Solitude feeds your gifts; your relationships carry them to the world.",
  "2/5":"Hermit/Heretic — Called upon to deliver practical solutions even when you'd rather disappear.",
  "3/5":"Martyr/Heretic — Your lived experiments create wisdom that others desperately need.",
  "3/6":"Martyr/Role Model — A life in three acts: experiment, retreat, embody.",
  "4/6":"Opportunist/Role Model — Your community holds your destiny; connection is your path.",
  "4/1":"Opportunist/Investigator — Relationships anchor your foundation of deep knowledge.",
  "5/1":"Heretic/Investigator — Here to offer practical, universal solutions to those who need them.",
  "5/2":"Heretic/Hermit — Called to serve even when you would rather be left alone.",
  "6/2":"Role Model/Hermit — Living proof of what is possible for other women.",
  "6/3":"Role Model/Martyr — A wise elder shaped by a thousand experiments.",
};
const HD_QUIZ = [
  { q:"When you have an idea or want to start something new, what feels most natural?", options:[
    { text:"I just go for it — I feel called to initiate and move",           types:["Manifestor"] },
    { text:"I wait until something genuinely lights me up, then I respond",   types:["Generator","Manifesting Generator"] },
    { text:"I wait to be invited or recognized before I step forward",        types:["Projector"] },
    { text:"I observe and take my time — major decisions need a full cycle",  types:["Reflector"] },
  ]},
  { q:"How would you describe your energy throughout the day?", options:[
    { text:"Consistent and sustainable — I can work for hours on things I love", types:["Generator","Manifesting Generator"] },
    { text:"Comes in powerful bursts — very on, then I need quiet",             types:["Manifestor","Projector"] },
    { text:"Deeply shaped by the people and spaces around me",                 types:["Reflector","Projector"] },
    { text:"I jump between multiple passions quickly — variety is essential",  types:["Manifesting Generator"] },
  ]},
  { q:"When something feels off or out of alignment, what shows up?", options:[
    { text:"Frustration — like I'm pushing but nothing flows",   types:["Generator"] },
    { text:"Anger — I feel unseen or like I'm hitting walls",    types:["Manifestor"] },
    { text:"Bitterness — my gifts feel unrecognized or wasted",  types:["Projector"] },
    { text:"Disappointment — the world feels out of harmony",    types:["Reflector"] },
    { text:"All of the above depending on the situation",        types:["Manifesting Generator"] },
  ]},
  { q:"In relationships and group settings, which feels most like you?", options:[
    { text:"I prefer to tell people what I'm doing rather than ask permission", types:["Manifestor"] },
    { text:"I respond best when people make offers or ask me questions",        types:["Generator","Manifesting Generator"] },
    { text:"I thrive when someone seeks out my guidance and perspective",       types:["Projector"] },
    { text:"I absorb and reflect the energy of whoever I'm around",            types:["Reflector"] },
  ]},
];
function scoreQuiz(answers) {
  const scores = {Generator:0,"Manifesting Generator":0,Manifestor:0,Projector:0,Reflector:0};
  answers.forEach(a => { if(a) a.types.forEach(t => { scores[t]=(scores[t]||0)+1; }); });
  if (scores["Manifesting Generator"]>0 && scores["Generator"]>0) scores["Manifesting Generator"]+=0.5;
  return Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
}

// ─────────────────────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────────────────────
const S = {
  page:   { minHeight:"100vh", background:T.bg, color:T.cream, fontFamily:"'EB Garamond',serif", fontSize:17, paddingBottom:90 },
  header: { padding:"36px 20px 0", textAlign:"center" },
  title:  { fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:"0.28em", color:T.rose, textTransform:"uppercase", opacity:0.85 },
  section:{ margin:"24px 18px 0" },
  card:   { background:"rgba(255,255,255,0.9)", border:`1px solid rgba(196,120,106,0.15)`, borderRadius:14, padding:"18px", boxShadow:"0 2px 16px rgba(196,120,106,0.07)" },
  label:  { fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:"0.22em", color:T.creamMute, textTransform:"uppercase", marginBottom:8, display:"block" },
  input:  { width:"100%", background:"rgba(253,248,245,0.8)", border:`1px solid rgba(196,120,106,0.2)`, borderRadius:10, padding:"11px 14px", color:T.cream, fontSize:16, fontFamily:"'EB Garamond',serif" },
  btn:    (c=T.gold)=>({ background:`linear-gradient(135deg,${c}22,${c}11)`, border:`1px solid ${c}55`, borderRadius:10, padding:"12px 22px", color:c, fontFamily:"'Cinzel',serif", fontSize:12, letterSpacing:"0.18em", cursor:"pointer", textTransform:"uppercase", display:"inline-flex", alignItems:"center", gap:8, transition:"all 0.2s" }),
  btnFull:(c=T.gold)=>({ ...S.btn(c), width:"100%", justifyContent:"center" }),
};
function Spinner() { return <div style={{width:18,height:18,border:`2px solid ${T.border}`,borderTop:`2px solid ${T.gold}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>; }
function AIBadge({loading}) { return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:`${T.gold}18`,border:`1px solid ${T.gold}44`,borderRadius:6,padding:"3px 9px",fontSize:11,color:T.gold,fontFamily:"'Cinzel',serif",letterSpacing:"0.12em"}}>{loading?<Spinner/>:"✦"} AI</span>; }
function GoldDivider() { return <div style={{height:1,background:`linear-gradient(90deg,transparent,${T.gold}44,transparent)`,margin:"16px 0"}}/>; }

// ─────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────
const TABS = [
  {id:"home",    label:"Home",   icon:"🌸"},
  {id:"oracle",  label:"Oracle", icon:"✨"},
  {id:"dream",   label:"Dreams", icon:"🌙"},
  {id:"astro",   label:"Stars",  icon:"⭐"},
  {id:"hd",      label:"Design", icon:"💎"},
  {id:"journal", label:"Journal",icon:"📖"},
  {id:"stories", label:"Stories",icon:"🕊️"},
];
function Nav({active,onSelect}) {
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(253,248,245,0.97)",borderTop:`1px solid ${T.border}`,display:"flex",padding:"8px 0 env(safe-area-inset-bottom,8px)",boxShadow:"0 -4px 20px rgba(196,120,106,0.08)"}}>
      {TABS.map(t=>{
        const on=active===t.id;
        return (
          <button key={t.id} onClick={()=>onSelect(t.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",padding:"6px 1px 2px",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontSize:on?21:18,transition:"all 0.2s"}}>{t.icon}</span>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.1em",color:on?T.gold:T.creamMute,textTransform:"uppercase"}}>{t.label}</span>
            {on&&<div style={{width:16,height:1.5,background:T.gold,borderRadius:2}}/>}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────
function HomeTab({profile}) {
  const moon = getMoonPhase();
  const affirmation = AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];
  const stage = BLOOM_STAGES[Math.min(Math.floor((profile.journalCount||0)/3),4)];
  return (
    <div className="fade-up">
      <div style={{textAlign:"center",padding:"44px 20px 20px"}}>
        <div style={{fontSize:54,marginBottom:10,animation:"float 4s ease-in-out infinite"}}>{stage.icon}</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:26,letterSpacing:"0.12em",color:T.cream,marginBottom:6}}>Sacred Blooms</div>
        <div style={{color:T.gold,fontSize:14,letterSpacing:"0.18em",fontFamily:"'Cinzel',serif",opacity:0.8}}>
          {profile.name?`Welcome, ${profile.name}`:"A space to bloom"}
        </div>
      </div>
      <div style={S.section}>
        <div style={{...S.card,background:`linear-gradient(135deg,${T.surface},rgba(201,164,106,0.08))`,textAlign:"center",padding:"20px"}}>
          <span style={S.label}>Your Bloom Stage</span>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:19,color:T.gold,marginBottom:5}}>{stage.stage}</div>
          <div style={{color:T.creamSub,fontSize:15,fontStyle:"italic",lineHeight:1.6}}>{stage.desc}</div>
        </div>
      </div>
      <div style={S.section}>
        <div style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontSize:34}}>{moon.icon}</span>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:T.gold,marginBottom:3}}>{moon.name}</div>
            <div style={{color:T.creamSub,fontSize:14}}>{moon.energy}</div>
            <div style={{color:T.creamMute,fontSize:13,fontStyle:"italic",marginTop:3}}>{moon.ritual}</div>
          </div>
        </div>
      </div>
      <div style={S.section}>
        <span style={S.label}>✦ Today's Affirmation</span>
        <div style={{...S.card,textAlign:"center",padding:"24px 20px",background:`linear-gradient(135deg,${T.surface},rgba(196,120,106,0.08))`}}>
          <div style={{fontSize:30,marginBottom:12}}>💌</div>
          <div style={{fontStyle:"italic",fontSize:18,color:T.cream,lineHeight:1.7}}>"{affirmation}"</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ORACLE
// ─────────────────────────────────────────────────────────────
function OracleTab() {
  const [card,setCard] = useState(null);
  const [aiReading,setAiReading] = useState("");
  const [aiLoading,setAiLoading] = useState(false);
  const [question,setQuestion] = useState("");
  const [step,setStep] = useState("ask");

  function drawCard() {
    setCard(ORACLE_CARDS[Math.floor(Math.random()*ORACLE_CARDS.length)]);
    setStep("reveal"); setAiReading("");
  }
  async function getReading() {
    if(!card) return;
    setAiLoading(true); setStep("reading");
    try {
      const r = await askClaude(
        "You are a warm, wise oracle reader for Sacred Blooms — a spiritual wellness space for women healing and becoming. Speak in lyrical, grounded language. Be specific to the card and question. Speak directly to 'you.' 3–4 sentences.",
        `Card drawn: "${card.title}"\nCard message: "${card.message}"\nHer question: "${question||"open — she is open to what she needs"}"\n\nGive her a personalized oracle reading for this moment.`,
        320
      );
      setAiReading(r);
    } catch {
      setAiReading("The oracle is quiet for now. Sit with the card's message. Sometimes silence is the reading.");
    }
    setAiLoading(false);
  }
  function reset() { setStep("ask"); setCard(null); setQuestion(""); setAiReading(""); }

  return (
    <div className="fade-up">
      <div style={S.header}><div style={S.title}>Oracle Cards</div><div style={{color:T.creamMute,fontSize:14,marginTop:6}}>Draw when you need guidance</div></div>
      {step==="ask"&&(
        <div style={S.section}>
          <div style={S.card}>
            <span style={S.label}>Your question or intention (optional)</span>
            <textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What do I need to hear right now?…" style={{...S.input,resize:"none",height:88}}/>
          </div>
          <button onClick={drawCard} style={{...S.btnFull(T.gold),marginTop:14,padding:"15px",fontSize:14}}>✦ Draw Your Card</button>
        </div>
      )}
      {card&&step!=="ask"&&(
        <div style={{...S.section}} className="card-in">
          <div style={{...S.card,background:`linear-gradient(145deg,${card.color}18,${T.bg2})`,borderColor:`${card.color}44`,textAlign:"center",padding:"28px 20px"}}>
            <div style={{fontSize:50,marginBottom:12}}>{card.symbol}</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:18,color:card.color,letterSpacing:"0.08em",marginBottom:14}}>{card.title}</div>
            <GoldDivider/>
            <div style={{fontStyle:"italic",fontSize:16,color:T.creamSub,lineHeight:1.8}}>{card.message}</div>
          </div>
          {step==="reveal"&&(
            <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:10}}>
              <button onClick={getReading} style={S.btnFull(T.rose)}><AIBadge/> Receive Your Reading</button>
              <button onClick={reset} style={S.btnFull(T.creamMute)}>Draw Another</button>
            </div>
          )}
          {step==="reading"&&(
            <div style={{...S.card,marginTop:14,borderColor:`${T.rose}44`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><AIBadge loading={aiLoading}/><span style={{fontFamily:"'Cinzel',serif",fontSize:11,color:T.rose,letterSpacing:"0.15em",textTransform:"uppercase"}}>Your Reading</span></div>
              {aiLoading?<div style={{color:T.creamMute,fontStyle:"italic",fontSize:15}}>The oracle is speaking…</div>:<div style={{color:T.cream,lineHeight:1.85,fontSize:16,fontStyle:"italic"}}>{aiReading}</div>}
              {!aiLoading&&aiReading&&<button onClick={reset} style={{...S.btnFull(T.gold),marginTop:14}}>Draw Again</button>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DREAMS
// ─────────────────────────────────────────────────────────────
function DreamTab() {
  const [dreams,setDreams] = useStorage("sb_dreams",[]);
  const [form,setForm] = useState({description:"",feeling:"",symbols:""});
  const [interp,setInterp] = useState("");
  const [loading,setLoading] = useState(false);
  const [view,setView] = useState("new");

  async function interpret() {
    if(!form.description.trim()) return;
    setLoading(true); setView("result"); setInterp("");
    const words = (form.description+" "+form.symbols).toLowerCase();
    const hints = Object.entries(DREAM_SYMBOLS).filter(([k])=>words.includes(k)).map(([k,v])=>`${k}: ${v}`).join("\n");
    try {
      const text = await askClaude(
        "You are a deeply intuitive dream interpreter for Sacred Blooms. Blend Jungian symbolism with feminine spiritual wisdom. Speak warmly and directly. Offer 2–3 key insights, close with one grounding question. 200–250 words.",
        `Dream: ${form.description}\nFeeling upon waking: ${form.feeling||"not specified"}\nSymbols noticed: ${form.symbols||"none"}\n\nSymbol reference:\n${hints||"none detected"}`,
        380
      );
      setInterp(text);
      setDreams(p=>[{id:Date.now(),date:new Date().toLocaleDateString(),...form,interpretation:text},...p].slice(0,30));
    } catch {
      setInterp(hints ? `Your dream holds powerful imagery. ${hints.split("\n")[0]}. Sit with the feeling of ${form.feeling||"the dream"} — what in your waking life mirrors this?` : "Your dream carries wisdom. Journal freely about the images that stayed. The body always knows.");
    }
    setLoading(false);
  }

  if(view==="history") return (
    <div className="fade-up">
      <div style={S.header}><div style={S.title}>Dream Archive</div></div>
      <div style={{padding:"14px 18px 0"}}><button onClick={()=>setView("new")} style={S.btn(T.gold)}>+ New Dream</button></div>
      <div style={S.section}>
        {dreams.length===0?<div style={{...S.card,textAlign:"center",color:T.creamMute,fontStyle:"italic"}}>Your dream archive is empty.</div>
        :dreams.map(d=>(
          <div key={d.id} style={{...S.card,marginBottom:12}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:T.gold,marginBottom:6}}>{d.date}</div>
            <div style={{color:T.cream,fontSize:15}}>{d.description.slice(0,130)}{d.description.length>130?"…":""}</div>
            {d.feeling&&<div style={{color:T.creamMute,fontSize:13,fontStyle:"italic",marginTop:4}}>Feeling: {d.feeling}</div>}
          </div>
        ))}
      </div>
    </div>
  );

  if(view==="result") return (
    <div className="fade-up">
      <div style={S.header}><div style={S.title}>Dream Interpretation</div></div>
      <div style={{...S.card,margin:"20px 18px",borderColor:`${T.lavender}44`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><AIBadge loading={loading}/><span style={{fontFamily:"'Cinzel',serif",fontSize:11,color:T.lavender,letterSpacing:"0.15em",textTransform:"uppercase"}}>Interpretation</span></div>
        {loading?<div style={{color:T.creamMute,fontStyle:"italic"}}>Reading your dream…</div>:<div style={{color:T.cream,lineHeight:1.85,fontSize:16}}>{interp}</div>}
      </div>
      {!loading&&<div style={{...S.section,display:"flex",gap:10}}>
        <button onClick={()=>{setView("new");setForm({description:"",feeling:"",symbols:""});setInterp("");}} style={S.btnFull(T.gold)}>New Dream</button>
        <button onClick={()=>setView("history")} style={S.btnFull(T.creamMute)}>Archive</button>
      </div>}
    </div>
  );

  return (
    <div className="fade-up">
      <div style={S.header}><div style={S.title}>Dream Interpretation</div></div>
      <div style={{display:"flex",justifyContent:"flex-end",padding:"10px 18px 0"}}><button onClick={()=>setView("history")} style={S.btn(T.creamMute)}>Archive</button></div>
      <div style={S.section}>
        <div style={S.card}>
          <span style={S.label}>Describe your dream</span>
          <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Last night I dreamed of…" style={{...S.input,resize:"none",height:110}}/>
        </div>
        <div style={{...S.card,marginTop:12}}>
          <span style={S.label}>How Did You Feel Upon Waking?</span>
          <input value={form.feeling} onChange={e=>setForm(f=>({...f,feeling:e.target.value}))} placeholder="Peaceful, unsettled, hopeful…" style={S.input}/>
        </div>
        <div style={{...S.card,marginTop:12}}>
          <span style={S.label}>Symbols or images that stood out</span>
          <input value={form.symbols} onChange={e=>setForm(f=>({...f,symbols:e.target.value}))} placeholder="water, a door, my mother…" style={S.input}/>
        </div>
        <button onClick={interpret} disabled={!form.description.trim()} style={{...S.btnFull(T.lavender),marginTop:14,opacity:form.description.trim()?1:0.4}}>
          <AIBadge/> Interpret This Dream
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ASTROLOGY  — manual entry (always accurate) + AI reading
// ─────────────────────────────────────────────────────────────
function AstroTab() {
  const [saved,setSaved] = useStorage("sb_astro",{dob:"",sunSign:"",moonSign:"",risingSign:""});
  const [dob,setDob] = useState(saved.dob||"");
  const [sun,setSun] = useState(saved.sunSign||"");
  const [moon,setMoon] = useState(saved.moonSign||"");
  const [rising,setRising] = useState(saved.risingSign||"");
  const [reading,setReading] = useState("");
  const [readLoading,setReadLoading] = useState(false);
  const [showChart,setShowChart] = useState(!!saved.sunSign);

  function saveChart() {
    if(!sun||!moon) return;
    setSaved({dob,sunSign:sun,moonSign:moon,risingSign:rising});
    setShowChart(true); setReading("");
  }
  const lpNum = dob ? calcLifePath(dob) : null;
  const lp = lpNum ? LIFE_PATHS[lpNum] : null;

  async function getReading() {
    setReadLoading(true);
    try {
      const r = await askClaude(
        "You are a warm, lyrical astrologer for Sacred Blooms — a healing space for women. Be specific to these exact placements, not generic. Speak to her healing journey and becoming. 220–260 words.",
        `Sun: ${sun}\nMoon: ${moon}\nRising: ${rising||"unknown"}\n${lp?`Life Path ${lpNum}: ${lp.keyword}`:""}\n\nGive her a rich personal reading weaving these placements together around her growth and becoming.`,
        440
      );
      setReading(r);
    } catch {
      setReading(`Your ${sun} Sun is your core — how you shine in the world. Your ${moon} Moon is your emotional home — how you heal, what makes you feel safe.${rising?` Your ${rising} Rising is how the world first meets you.`:""} ${lp?`As Life Path ${lpNum} — ${lp.keyword} — ${lp.gift}`:""}`);
    }
    setReadLoading(false);
  }

  return (
    <div className="fade-up">
      <div style={S.header}><div style={S.title}>Astrology & Numerology</div><div style={{color:T.creamMute,fontSize:14,marginTop:6}}>Your cosmic blueprint</div></div>
      <div style={S.section}>
        <div style={S.card}>
          <div style={{color:T.creamSub,fontSize:14,lineHeight:1.7,marginBottom:14}}>
            Enter your placements below. Don't know yours? Look them up free at <span style={{color:T.gold}}>astro.com</span> or <span style={{color:T.gold}}>astro-seek.com</span> with your birth date, time, and city.
          </div>
          <span style={S.label}>Date of Birth (for Life Path)</span>
          <input type="date" value={dob} onChange={e=>{setDob(e.target.value);setShowChart(false);}} style={S.input}/>
          <span style={{...S.label,marginTop:14}}>☀️ Sun Sign</span>
          <select value={sun} onChange={e=>{setSun(e.target.value);setShowChart(false);}} style={{...S.input,cursor:"pointer"}}>
            <option value="">Select your Sun sign…</option>
            {ALL_SIGNS.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <span style={{...S.label,marginTop:14}}>🌙 Moon Sign</span>
          <select value={moon} onChange={e=>{setMoon(e.target.value);setShowChart(false);}} style={{...S.input,cursor:"pointer"}}>
            <option value="">Select your Moon sign…</option>
            {ALL_SIGNS.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <span style={{...S.label,marginTop:14}}>⭐ Rising Sign (optional)</span>
          <select value={rising} onChange={e=>{setRising(e.target.value);setShowChart(false);}} style={{...S.input,cursor:"pointer"}}>
            <option value="">Unknown / skip</option>
            {ALL_SIGNS.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={saveChart} disabled={!sun||!moon} style={{...S.btnFull(T.gold),marginTop:16,opacity:(sun&&moon)?1:0.4}}>✦ Save My Chart</button>
        </div>

        {showChart&&(
          <div className="card-in">
            <div style={{display:"flex",gap:10,marginTop:14}}>
              {[{label:"Sun",sign:sun,icon:"☀️",color:T.gold},{label:"Moon",sign:moon,icon:"🌙",color:T.lavender},{label:"Rising",sign:rising||"?",icon:"⭐",color:T.rose}].map(s=>(
                <div key={s.label} style={{flex:1,...S.card,textAlign:"center",borderColor:`${s.color}44`,padding:"14px 6px"}}>
                  <div style={{fontSize:20,marginBottom:4}}>{s.icon}</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:s.color,letterSpacing:"0.16em",marginBottom:4}}>{s.label}</div>
                  <div style={{fontSize:17}}>{SIGN_GLYPHS[s.sign]||"?"}</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:T.cream,marginTop:3}}>{s.sign}</div>
                </div>
              ))}
            </div>
            {lp&&(
              <div style={{...S.card,marginTop:14,background:`linear-gradient(135deg,${T.surface},rgba(201,164,106,0.09))`,borderColor:`${T.gold}44`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:26,color:T.gold,lineHeight:1}}>{lpNum}</div>
                  <div><div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:T.gold,letterSpacing:"0.18em",textTransform:"uppercase"}}>Life Path</div><div style={{fontFamily:"'Cinzel',serif",fontSize:14,color:T.cream}}>{lp.keyword}</div></div>
                </div>
                <GoldDivider/>
                <div style={{color:T.creamSub,fontSize:15,lineHeight:1.7,marginBottom:8}}>{lp.gift}</div>
                <div style={{color:T.creamMute,fontSize:13,fontStyle:"italic",lineHeight:1.6,marginBottom:8}}>Shadow: {lp.shadow}</div>
                <div style={{color:T.rose,fontSize:14,fontStyle:"italic"}}>"{lp.affirmation}"</div>
              </div>
            )}
            <button onClick={getReading} style={{...S.btnFull(T.lavender),marginTop:14}}>
              <AIBadge loading={readLoading}/> {readLoading?"Reading your chart…":"Read My Full Chart"}
            </button>
            {reading&&<div style={{...S.card,marginTop:14,borderColor:`${T.lavender}44`}} className="card-in"><div style={{color:T.cream,lineHeight:1.88,fontSize:16,fontStyle:"italic"}}>{reading}</div></div>}
            <button onClick={()=>{setShowChart(false);setSaved({dob:"",sunSign:"",moonSign:"",risingSign:""});setSun("");setMoon("");setRising("");setDob("");setReading("");}} style={{...S.btnFull(T.creamMute),marginTop:12,fontSize:11}}>Reset Chart</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HUMAN DESIGN  — quiz or known type
// ─────────────────────────────────────────────────────────────
function HDTab() {
  const [hdP,setHDP] = useStorage("sb_hd",{type:"",profile:"",defined:"",discovered:false});
  const [mode,setMode] = useState(hdP.type?"result":"start");
  const [step,setStep] = useState(0);
  const [answers,setAnswers] = useState([]);
  const [reading,setReading] = useState("");
  const [loading,setLoading] = useState(false);

  function pickAnswer(opt) {
    const updated=[...answers]; updated[step]=opt; setAnswers(updated);
    if(step<HD_QUIZ.length-1){setStep(step+1);}
    else{const t=scoreQuiz(updated);setHDP(p=>({...p,type:t,discovered:true}));setMode("result");}
  }
  async function getReading() {
    setLoading(true);
    const info=HD_TYPES[hdP.type]||{};
    try {
      const r = await askClaude(
        "You are a warm Human Design guide for Sacred Blooms — a healing space for women. Be specific to their type and profile. Avoid jargon. Help her understand how to live in alignment with her natural energy. 220–260 words.",
        `Type: ${hdP.type}${hdP.discovered?" (via self-reflection quiz)":""}\nProfile: ${hdP.profile||"not yet known"}\nDefined centers: ${hdP.defined||"not yet known"}\nStrategy: ${info.strategy||""}\n\nGive her a personal Human Design reading focused on her healing and alignment.`,
        440
      );
      setReading(r);
    } catch {
      const info2=HD_TYPES[hdP.type]||{};
      setReading(`As a ${hdP.type}, ${info2.desc||""} Your strategy is to ${info2.strategy||"trust your energy"}. ${hdP.profile?`Profile ${hdP.profile}: ${HD_PROFILES[hdP.profile]||""}`:""} For your complete chart, visit mybodygraph.com with your birth date, time, and city.`);
    }
    setLoading(false);
  }

  if(mode==="start") return (
    <div className="fade-up">
      <div style={S.header}><div style={S.title}>Human Design</div><div style={{color:T.creamMute,fontSize:14,marginTop:6}}>Your energetic blueprint</div></div>
      <div style={S.section}>
        <div style={{...S.card,textAlign:"center",padding:"26px 20px"}}>
          <div style={{fontSize:38,marginBottom:12}}>💎</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:15,color:T.cream,marginBottom:10}}>Do you know your Human Design type?</div>
          <div style={{color:T.creamMute,fontSize:14,lineHeight:1.7,marginBottom:20}}>Human Design reveals how your energy naturally works — your strategy for decisions, your aura, and how you're designed to move through the world.</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <button onClick={()=>setMode("quiz")} style={S.btnFull(T.sage)}>✦ Discover My Type (4 questions)</button>
            <button onClick={()=>setMode("known")} style={S.btnFull(T.gold)}>I Know My Type</button>
          </div>
        </div>
      </div>
    </div>
  );

  if(mode==="quiz") {
    const q=HD_QUIZ[step];
    return (
      <div className="fade-up">
        <div style={S.header}><div style={S.title}>Discover Your Type</div><div style={{color:T.creamMute,fontSize:13,marginTop:6}}>{step+1} of {HD_QUIZ.length}</div></div>
        <div style={{height:2,background:T.border,margin:"14px 18px 0"}}><div style={{height:2,background:T.sage,width:`${((step+1)/HD_QUIZ.length)*100}%`,transition:"width 0.3s",borderRadius:2}}/></div>
        <div style={S.section}>
          <div style={{...S.card,marginBottom:14}}><div style={{fontFamily:"'Cinzel',serif",fontSize:15,color:T.cream,lineHeight:1.6}}>{q.q}</div></div>
          {q.options.map((opt,i)=>(
            <button key={i} onClick={()=>pickAnswer(opt)} style={{...S.card,width:"100%",textAlign:"left",cursor:"pointer",marginBottom:10,display:"block",padding:"14px 16px",color:T.creamSub,fontSize:15,lineHeight:1.6,fontFamily:"'EB Garamond',serif",transition:"all 0.2s",border:`1px solid ${T.border}`}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.sage;e.currentTarget.style.color=T.cream;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.creamSub;}}>
              {opt.text}
            </button>
          ))}
          {step>0&&<button onClick={()=>setStep(step-1)} style={{color:T.creamMute,background:"none",border:"none",cursor:"pointer",fontSize:13,fontFamily:"'Cinzel',serif",letterSpacing:"0.12em"}}>← Back</button>}
        </div>
      </div>
    );
  }

  if(mode==="known") return (
    <div className="fade-up">
      <div style={S.header}><div style={S.title}>Your Human Design</div></div>
      <div style={S.section}>
        <div style={S.card}>
          <span style={S.label}>Energy Type</span>
          <select value={hdP.type} onChange={e=>setHDP(p=>({...p,type:e.target.value}))} style={{...S.input,cursor:"pointer"}}>
            <option value="">Select your type…</option>
            {Object.keys(HD_TYPES).map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <span style={{...S.label,marginTop:14}}>Profile (optional)</span>
          <select value={hdP.profile} onChange={e=>setHDP(p=>({...p,profile:e.target.value}))} style={{...S.input,cursor:"pointer"}}>
            <option value="">Select profile…</option>
            {Object.keys(HD_PROFILES).map(p=><option key={p} value={p}>{p}</option>)}
          </select>
          <span style={{...S.label,marginTop:14}}>Defined Centers (optional)</span>
          <input value={hdP.defined} onChange={e=>setHDP(p=>({...p,defined:e.target.value}))} placeholder="Sacral, Heart, Throat…" style={S.input}/>
          <button onClick={()=>setMode("result")} disabled={!hdP.type} style={{...S.btnFull(T.sage),marginTop:16,opacity:hdP.type?1:0.4}}>Continue →</button>
        </div>
      </div>
    </div>
  );

  const info=HD_TYPES[hdP.type]||{};
  const pd=HD_PROFILES[hdP.profile]||"";
  return (
    <div className="fade-up">
      <div style={S.header}><div style={S.title}>Human Design</div></div>
      <div style={S.section}>
        <div style={{...S.card,background:`linear-gradient(135deg,${T.surface},rgba(122,158,138,0.1))`,borderColor:`${T.sage}55`}}>
          {hdP.discovered&&<div style={{fontSize:11,color:T.sage,fontFamily:"'Cinzel',serif",letterSpacing:"0.14em",marginBottom:8}}>✦ DISCOVERED VIA QUIZ</div>}
          <div style={{fontFamily:"'Cinzel',serif",fontSize:22,color:T.sage,marginBottom:5}}>{hdP.type}</div>
          <div style={{color:T.creamMute,fontSize:13,fontStyle:"italic",marginBottom:10}}>{info.aura}</div>
          <GoldDivider/>
          <div style={{color:T.creamSub,fontSize:15,lineHeight:1.7,marginBottom:10}}>{info.desc}</div>
          <div><span style={{color:T.gold,fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:"0.14em"}}>STRATEGY</span><br/><span style={{color:T.cream,fontSize:14}}>{info.strategy}</span></div>
          {hdP.profile&&pd&&<><GoldDivider/><div style={{color:T.creamMute,fontSize:13,fontStyle:"italic"}}>Profile {hdP.profile}: {pd}</div></>}
        </div>
        {!hdP.discovered&&<div style={{...S.card,marginTop:10,borderColor:`${T.gold}33`,fontSize:12,color:T.creamMute,fontStyle:"italic",lineHeight:1.7}}>✦ Get your complete chart (profile, gates, centers) free at <span style={{color:T.gold}}>mybodygraph.com</span> with your birth date, time, and city.</div>}
        <button onClick={getReading} style={{...S.btnFull(T.sage),marginTop:14}}><AIBadge loading={loading}/> {loading?"Reading your design…":"Read My Design"}</button>
        {reading&&<div style={{...S.card,marginTop:14,borderColor:`${T.sage}44`}} className="card-in"><div style={{color:T.cream,lineHeight:1.88,fontSize:16}}>{reading}</div></div>}
        <button onClick={()=>{setHDP({type:"",profile:"",defined:"",discovered:false});setReading("");setAnswers([]);setStep(0);setMode("start");}} style={{...S.btnFull(T.creamMute),marginTop:12,fontSize:11}}>Start Over</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// JOURNAL
// ─────────────────────────────────────────────────────────────
function JournalTab({profile,setProfile}) {
  const [entries,setEntries] = useStorage("sb_journal",[]);
  const [theme,setTheme] = useState(null);
  const [intention,setIntention] = useState("");
  const [prompt,setPrompt] = useState("");
  const [entry,setEntry] = useState("");
  const [promptLoading,setPromptLoading] = useState(false);
  const [view,setView] = useState("home");

  async function getPrompt() {
    if(!theme) return;
    setPromptLoading(true);
    try {
      const p = await askClaude(
        "You are a sacred journaling guide for Sacred Blooms. Create one single powerful journaling prompt. Specific, evocative, NOT generic. Speak to the soul. One to two sentences maximum.",
        `Theme: ${theme.label}\nIntention: ${intention||"open"}\n\nOne journaling prompt.`,
        100
      );
      setPrompt(p);
    } catch {
      const fallbacks={"New Moon Intentions":"What are you ready to call in that your former self couldn't have held?","Shadow Work":"What part of yourself have you been hiding even from your own reflection?","Gratitude Portal":"Name something you almost didn't notice today that deserves to be seen.","Love Letter to Self":"What would you say to the version of you who didn't think she would make it through?","Releasing & Letting Go":"What are you still carrying that was never yours to hold?","Future Self":"Describe one ordinary Tuesday in the life of the woman you are becoming.","Dream Reflection":"What emotion from your dream is also alive in your waking life right now?","Ancestral Healing":"What pattern do you want to be the last generation to carry?"};
      setPrompt(fallbacks[theme.label]||"What truth have you been circling around but not yet speaking?");
    }
    setPromptLoading(false);
  }
  function saveEntry() {
    if(!entry.trim()) return;
    const e={id:Date.now(),date:new Date().toLocaleDateString(),theme:theme?.label||"Free Write",prompt,entry,intention};
    setEntries(p=>[e,...p].slice(0,50));
    setProfile(p=>({...p,journalCount:(p.journalCount||0)+1}));
    setEntry(""); setTheme(null); setPrompt(""); setIntention(""); setView("home");
  }

  if(view==="history") {
    const [reading,setReading] = useState(null);

    if(reading) return (
      <div className="fade-up">
        <div style={S.header}><div style={S.title}>{reading.theme}</div><div style={{color:T.creamMute,fontSize:13,marginTop:4}}>{reading.date}</div></div>
        <div style={{padding:"12px 18px 0"}}><button onClick={()=>setReading(null)} style={S.btn(T.gold)}>← Back</button></div>
        <div style={S.section}>
          {reading.prompt&&(
            <div style={{...S.card,marginBottom:14,background:`linear-gradient(135deg,${T.surface},rgba(196,120,106,0.07))`,borderColor:`${T.rose}44`}}>
              <span style={S.label}>✦ Prompt</span>
              <div style={{fontStyle:"italic",color:T.rose,lineHeight:1.75,fontSize:15}}>{reading.prompt}</div>
              {reading.intention&&<div style={{color:T.creamMute,fontSize:13,marginTop:8,fontStyle:"italic"}}>Intention: {reading.intention}</div>}
            </div>
          )}
          <div style={{...S.card,borderColor:`${T.rose}22`}}>
            <div style={{color:T.cream,fontSize:16,lineHeight:1.85,whiteSpace:"pre-wrap"}}>{reading.entry}</div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="fade-up">
        <div style={S.header}><div style={S.title}>Journal Archive</div></div>
        <div style={{padding:"14px 18px 0"}}><button onClick={()=>setView("home")} style={S.btn(T.gold)}>← Back</button></div>
        <div style={S.section}>
          {entries.length===0
            ?<div style={{...S.card,textAlign:"center",color:T.creamMute,fontStyle:"italic"}}>Your journal is waiting for your first entry.</div>
            :entries.map(e=>(
              <div key={e.id} onClick={()=>setReading(e)} style={{...S.card,marginBottom:12,borderColor:`${T.rose}22`,cursor:"pointer",transition:"all 0.2s"}}
                onMouseEnter={el=>el.currentTarget.style.borderColor=`${T.rose}55`}
                onMouseLeave={el=>el.currentTarget.style.borderColor=`${T.rose}22`}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontFamily:"'Cinzel',serif",fontSize:11,color:T.gold}}>{e.date}</span>
                  <span style={{fontSize:11,color:T.creamMute}}>{e.theme}</span>
                </div>
                {e.prompt&&<div style={{color:T.rose,fontSize:13,fontStyle:"italic",marginBottom:6,lineHeight:1.5}}>"{e.prompt.slice(0,80)}{e.prompt.length>80?"…":""}"</div>}
                <div style={{color:T.creamSub,fontSize:15,lineHeight:1.6}}>{e.entry.slice(0,120)}{e.entry.length>120?"…":""}</div>
                <div style={{color:T.creamMute,fontSize:12,marginTop:8}}>Tap to read full entry ›</div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  if(view==="write") return (
    <div className="fade-up">
      <div style={S.header}><div style={S.title}>{theme?.label}</div></div>
      <div style={S.section}>
        {prompt&&<div style={{...S.card,marginBottom:14,background:`linear-gradient(135deg,${T.surface},rgba(196,120,106,0.06))`,borderColor:`${T.rose}44`}}><span style={S.label}>Your Prompt</span><div style={{fontStyle:"italic",color:T.cream,lineHeight:1.75,fontSize:16}}>{prompt}</div></div>}
        <textarea value={entry} onChange={e=>setEntry(e.target.value)} placeholder="Begin here. There is no wrong way to begin…" style={{...S.input,resize:"none",height:260,lineHeight:1.8,fontSize:16}} autoFocus/>
        <div style={{display:"flex",gap:10,marginTop:14}}>
          <button onClick={saveEntry} disabled={!entry.trim()} style={{...S.btnFull(T.gold),opacity:entry.trim()?1:0.4}}>Save Entry</button>
          <button onClick={()=>setView("home")} style={S.btnFull(T.creamMute)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fade-up">
      <div style={S.header}>
        <div style={S.title}>Sacred Journal</div>
        {!profile.name&&<div style={{marginTop:12}}><input value={profile.name||""} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} placeholder="Your name (optional)" style={{...S.input,width:"auto",textAlign:"center",background:"none",border:`1px solid ${T.border}`,borderRadius:30,padding:"8px 18px",fontSize:14}}/></div>}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",padding:"10px 18px 0"}}><button onClick={()=>setView("history")} style={S.btn(T.creamMute)}>Archive ({entries.length})</button></div>
      <div style={S.section}>
        <span style={S.label}>Choose a theme</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {JOURNAL_THEMES.map(t=>(
            <button key={t.label} onClick={()=>setTheme(t)} style={{background:theme?.label===t.label?`${t.color}22`:T.surface,border:`1px solid ${theme?.label===t.label?t.color:T.border}`,borderRadius:12,padding:"14px 10px",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
              <div style={{fontSize:22,marginBottom:4}}>{t.icon}</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:theme?.label===t.label?t.color:T.creamSub,letterSpacing:"0.12em"}}>{t.label}</div>
            </button>
          ))}
        </div>
        {theme&&(
          <div className="fade-in" style={{marginTop:14}}>
            <div style={S.card}>
              <span style={S.label}>Set your intention (optional)</span>
              <input value={intention} onChange={e=>setIntention(e.target.value)} placeholder="What are you releasing, calling in, or exploring?" style={S.input}/>
              <button onClick={getPrompt} style={{...S.btnFull(T.rose),marginTop:12}}>
                {promptLoading?<><AIBadge loading/> Generating…</>:<><AIBadge/> Generate My Prompt</>}
              </button>
            </div>
            {prompt&&<div className="card-in" style={{...S.card,marginTop:12,borderColor:`${T.rose}44`}}><span style={S.label}>Your prompt</span><div style={{fontStyle:"italic",color:T.cream,lineHeight:1.75}}>{prompt}</div></div>}
            <button onClick={()=>setView("write")} style={{...S.btnFull(T.gold),marginTop:14}}>✦ Begin Writing</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STORIES  — anonymous community sharing
// ─────────────────────────────────────────────────────────────
function StoriesTab() {
  const [stories,setStories] = useStorage("sb_stories", SEED_STORIES);
  const [view,setView] = useState("feed"); // feed | share | read
  const [selected,setSelected] = useState(null);
  const [filter,setFilter] = useState("All");
  const [form,setForm] = useState({theme:"",title:"",body:""});
  const [replyText,setReplyText] = useState("");

  const filtered = filter==="All" ? stories : stories.filter(s=>s.theme===filter);

  function submitStory() {
    if(!form.theme||!form.title.trim()||!form.body.trim()) return;
    const initials = ["A","B","C","D","E","F","G","H","J","K","L","M","N","P","R","S","T","V","W","Z"];
    const s = { id:Date.now(), theme:form.theme, title:form.title, body:form.body, initials:initials[Math.floor(Math.random()*initials.length)], moon:getMoonPhase().name, replies:[] };
    setStories(p=>[s,...p]);
    setForm({theme:"",title:"",body:""}); setView("feed");
  }
  function submitReply() {
    if(!replyText.trim()||!selected) return;
    const initials=["A","B","C","D","E","F","G","H","J","K","L","M","N","P","R","S","T","V","W","Z"];
    const reply={id:Date.now(),text:replyText,initials:initials[Math.floor(Math.random()*initials.length)]};
    setStories(p=>p.map(s=>s.id===selected.id?{...s,replies:[...(s.replies||[]),reply]}:s));
    setSelected(prev=>({...prev,replies:[...(prev.replies||[]),reply]}));
    setReplyText("");
  }

  if(view==="share") return (
    <div className="fade-up">
      <div style={S.header}><div style={S.title}>Share Your Story</div><div style={{color:T.creamMute,fontSize:14,marginTop:6}}>Anonymous. Sacred. Safe.</div></div>
      <div style={S.section}>
        <div style={S.card}>
          <span style={S.label}>Theme</span>
          <select value={form.theme} onChange={e=>setForm(f=>({...f,theme:e.target.value}))} style={{...S.input,cursor:"pointer"}}>
            <option value="">Choose a theme…</option>
            {STORY_THEMES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <span style={{...S.label,marginTop:14}}>Title</span>
          <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Give your story a title…" style={S.input}/>
          <span style={{...S.label,marginTop:14}}>Your Story</span>
          <textarea value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} placeholder="This is your space. No judgment. No names. Just truth…" style={{...S.input,resize:"none",height:160}}/>
          <div style={{color:T.creamMute,fontSize:12,fontStyle:"italic",marginTop:8}}>✦ Posted anonymously. Only your theme is shown.</div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:14}}>
          <button onClick={submitStory} disabled={!form.theme||!form.title.trim()||!form.body.trim()} style={{...S.btnFull(T.rose),opacity:(form.theme&&form.title.trim()&&form.body.trim())?1:0.4}}>Share Anonymously</button>
          <button onClick={()=>setView("feed")} style={S.btnFull(T.creamMute)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  if(view==="read"&&selected) return (
    <div className="fade-up">
      <div style={S.header}><div style={S.title}>{selected.theme}</div></div>
      <div style={{padding:"10px 18px 0"}}><button onClick={()=>{setView("feed");setSelected(null);setReplyText("");}} style={S.btn(T.gold)}>← Back</button></div>
      <div style={S.section}>
        <div style={{...S.card,borderColor:`${T.rose}44`,padding:"22px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:`${T.rose}33`,border:`1px solid ${T.rose}55`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",fontSize:14,color:T.rose}}>{selected.initials}</div>
            <div><div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:T.cream}}>{selected.title}</div><div style={{fontSize:12,color:T.creamMute}}>{selected.moon}</div></div>
          </div>
          <div style={{color:T.creamSub,fontSize:16,lineHeight:1.85}}>{selected.body}</div>
        </div>

        {(selected.replies||[]).length>0&&(
          <div style={{marginTop:14}}>
            <span style={S.label}>Responses ({selected.replies.length})</span>
            {selected.replies.map(r=>(
              <div key={r.id} style={{...S.card,marginBottom:10,borderColor:`${T.sage}33`}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:`${T.sage}22`,border:`1px solid ${T.sage}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",fontSize:11,color:T.sage,flexShrink:0}}>{r.initials}</div>
                  <div style={{color:T.creamSub,fontSize:15,lineHeight:1.7}}>{r.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{...S.card,marginTop:14}}>
          <span style={S.label}>Leave a response (anonymous)</span>
          <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Hold space for her story…" style={{...S.input,resize:"none",height:80}}/>
          <button onClick={submitReply} disabled={!replyText.trim()} style={{...S.btnFull(T.sage),marginTop:10,opacity:replyText.trim()?1:0.4}}>Send Response</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fade-up">
      <div style={S.header}><div style={S.title}>Sacred Stories</div><div style={{color:T.creamMute,fontSize:14,marginTop:6}}>Anonymous. Real. Healing.</div></div>
      <div style={{display:"flex",justifyContent:"flex-end",padding:"10px 18px 0"}}><button onClick={()=>setView("share")} style={S.btn(T.rose)}>+ Share Your Story</button></div>

      {/* Theme filter */}
      <div style={{overflowX:"auto",display:"flex",gap:8,padding:"14px 18px 0",scrollbarWidth:"none"}}>
        {["All",...STORY_THEMES].map(t=>(
          <button key={t} onClick={()=>setFilter(t)} style={{background:filter===t?`${T.rose}22`:T.surface,border:`1px solid ${filter===t?T.rose:T.border}`,borderRadius:20,padding:"6px 14px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:10,color:filter===t?T.rose:T.creamMute,letterSpacing:"0.12em",whiteSpace:"nowrap",flexShrink:0}}>
            {t}
          </button>
        ))}
      </div>

      <div style={S.section}>
        {filtered.length===0
          ?<div style={{...S.card,textAlign:"center",color:T.creamMute,fontStyle:"italic"}}>No stories yet in this theme. Be the first to share.</div>
          :filtered.map(story=>(
            <div key={story.id} onClick={()=>{setSelected(story);setView("read");}} style={{...S.card,marginBottom:12,cursor:"pointer",transition:"all 0.2s",borderColor:`${T.border}`}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${T.rose}55`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:`${T.rose}22`,border:`1px solid ${T.rose}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",fontSize:12,color:T.rose}}>{story.initials}</div>
                <div>
                  <div style={{display:"inline-block",background:`${T.rose}18`,border:`1px solid ${T.rose}33`,borderRadius:10,padding:"2px 8px",fontFamily:"'Cinzel',serif",fontSize:9,color:T.rose,letterSpacing:"0.12em",marginBottom:2}}>{story.theme}</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:T.cream}}>{story.title}</div>
                </div>
              </div>
              <div style={{color:T.creamSub,fontSize:15,lineHeight:1.7}}>{story.body.slice(0,140)}{story.body.length>140?"…":""}</div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
                <span style={{fontSize:12,color:T.creamMute}}>{story.moon}</span>
                <span style={{fontSize:12,color:T.creamMute}}>{(story.replies||[]).length} responses ›</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────
export default function SacredBlooms() {
  const [tab,setTab] = useState("home");
  const [profile,setProfile] = useStorage("sb_profile",{name:"",journalCount:0});
  return (
    <>
      <style>{CSS}</style>
      <div style={S.page}>
        {tab==="home"    && <HomeTab profile={profile}/>}
        {tab==="oracle"  && <OracleTab/>}
        {tab==="dream"   && <DreamTab/>}
        {tab==="astro"   && <AstroTab/>}
        {tab==="hd"      && <HDTab/>}
        {tab==="journal" && <JournalTab profile={profile} setProfile={setProfile}/>}
        {tab==="stories" && <StoriesTab/>}
      </div>
      <Nav active={tab} onSelect={setTab}/>
    </>
  );
}
