"use client"
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"

const COLORS = { bg: "#030405", midnight: "#0A1A2A", cyan: "#00D4FF", emerald: "#00FFA3", ice: "#E8F0FF", gold: "#FFD700" }

// UPDATE WITH YOUR REAL STRIPE PRICE IDS
const PRICE_IDS = {
  theme_nebula: "price_1ABC123",
  forge_pro: "price_2DEF456", 
  lore_gateway: "price_3GHI789",
  focus_chamber: "price_4JKL012"
}

const PLUGINS = [
  {id:"theme_nebula", name:"Nebula Graphite Theme", price: 4.99, founderPrice: 2.49, type:"cosmetic"},
  {id:"forge_pro", name:"Mission Forge Pro", price: 9.99, founderPrice: 4.99, type:"tool"},
  {id:"lore_gateway", name:"Lore: The First Gateway", price: 2.99, founderPrice: 1.49, type:"lore"},
  {id:"focus_chamber", name:"Focus Chamber", price: 1.99, founderPrice: 0.99, type:"subscription", recurring:true}
]

// ===== HOOKS =====
function useAURA() {
  const speak = (text) => {
    if('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text)
      u.voice = speechSynthesis.getVoices().find(v=>v.name.includes("Microsoft Zira")) || null
      u.rate = 0.9; u.pitch = 1.1
      speechSynthesis.speak(u)
    }
  }
  return speak
}

function usePrivacy() {
  const [consent, setConsent] = useState(localStorage.getItem("xiantron_consent") === "true")
  const anonymousId = useRef(localStorage.getItem("xiantron_id") || crypto.randomUUID())

  const giveConsent = () => {
    localStorage.setItem("xiantron_consent", "true")
    localStorage.setItem("xiantron_id", anonymousId.current)
    setConsent(true)
  }
  const deleteAll = () => {
    localStorage.clear()
    setConsent(false)
    window.location.reload()
  }
  return {consent, giveConsent, deleteAll, anonymousId: anonymousId.current}
}

function useTelemetry(consent, anonymousId) {
  const log = (event, data={}) => {
    if(!consent) return
    const payload = {event, data, id: anonymousId, ts: Date.now()}
    console.log("TELEMETRY:", payload)
    // fetch("https://api.xiantron.com/telemetry", {method:"POST", body:JSON.stringify(payload)})
  }
  return log
}

function useSave(user, setUser, consent, anonymousId) {
  useEffect(() => {
    const saved = localStorage.getItem("xiantron_save")
    const owned = localStorage.getItem("xiantron_owned")
    if (saved) setUser(u => ({...JSON.parse(saved), owned: owned? JSON.parse(owned) : []}))
  }, [])

  useEffect(() => {
    localStorage.setItem("xiantron_save", JSON.stringify(user))
    localStorage.setItem("xiantron_owned", JSON.stringify(user.owned||[]))
    if(consent) {
      fetch("/api/save", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:anonymousId, data:user})})
    }
  }, [user, consent, anonymousId])
}

function useArchivePurchases(user, setUser, consent, log) {
  const purchase = async (item) => {
    log("purchase_intent", {item_id: item.id})
    const price_id = PRICE_IDS[item.id]

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        item_id: item.id,
        price_id,
        anonymous_id: localStorage.getItem("xiantron_id")
      })
    })
    const {url} = await res.json()
    window.location.href = url
  }
  const isOwned = (id) => (user.owned||[]).includes(id)
  return {purchase, isOwned}
}

// ===== COMPONENTS =====
function Intro({consent, giveConsent, onStart}) {
  if(!consent) return (
    <div className="h-screen flex-col items-center justify-center text-center p-8">
      <h1 className="text-3xl text-[#00FFA3]">Privacy First</h1>
      <p className="mt-4 max-w-md text-[#E8F0FF]/70">
        Xiantron collects only anonymous data to improve the world. 
        Nothing is tied to you. You can delete it anytime.
      </p>
      <button onClick={giveConsent} className="mt-8 px-8 py-3 bg-[#00D4FF]/20 border border-[#00D4FF] rounded-lg">
        I consent to anonymous data
      </button>
      <button onClick={onStart} className="mt-4 text-sm text-[#E8F0FF]/50">Continue without data</button>
    </div>
  )
  return (
    <div className="h-screen flex-col items-center justify-center text-center">
      <h1 className="text-5xl text-[#00D4FF]">XIANTRON</h1>
      <p className="mt-4 text-[#E8F0FF]/70">The game that becomes your OS</p>
      <button onClick={onStart} className="mt-8 px-12 py-4 bg-[#FFD700]/20 border-2 border-[#FFD700] text-[#FFD700] rounded-lg text-xl">
        Begin
      </button>
    </div>
  )
}

function Game({user, setUser, log, purchase, isOwned}) {
  useEffect(()=>{
    log("mission_start", {xp:user.xp})
    const t = setTimeout(()=>setUser(u=>({...u, hours:u.hours+0.1, xp:u.xp+10, trust:u.trust+5})), 3000)
    return ()=>clearTimeout(t)
  }, [])

  if(user.trust > 150 && user.hours > 0.1) return null // Will trigger phase change in App

  return (
    <div className="h-screen p-8">
      <h2 className="text-2xl text-[#00D4FF]">Mission: The First Gateway</h2>
      <p className="mt-4">Explore. Listen. Build trust.</p>
      <div className="mt-8">XP: {user.xp} | Trust: {user.trust} | Hours: {user.hours.toFixed(1)}</div>
      <button onClick={()=>setUser(u=>({...u, trust:u.trust+50, hours:u.hours+5}))} className="mt-8 px-6 py-3 bg-[#00FFA3]/20 rounded">
        Complete Mission
      </button>
    </div>
  )
}

function RealDoor({user, onEnterRealOS, log, anonymousId}) {
  const [progress, setProgress] = useState(0)
  const [wantUpdates, setWantUpdates] = useState(false)
  const [email, setEmail] = useState("")
  const speak = useAURA()
  const musicRef = useRef(null)

  useEffect(() => {
    musicRef.current = new Audio("https://cdn.pixabay.com/audio/2024/12/16/audio_684f218fd2.mp3")
    musicRef.current.loop = true; musicRef.current.volume = 0.0;
    musicRef.current.play().catch(()=>{})
    let vol = 0
    const fade = setInterval(()=>{vol+=0.01; if(musicRef.current) musicRef.current.volume=vol; if(vol>=0.15) clearInterval(fade)}, 100)

    speak("Explorer. You did it. The world is ready for you now.")
    log("final_door_reached", {xp:user.xp, hours:user.hours})

    const i = setInterval(()=>setProgress(p=>p<100?p+1.5:100), 120)
    return ()=>{clearInterval(i); clearInterval(fade); if(musicRef.current) musicRef.current.pause()}
  }, [])

  const handleEnter = async () => {
    if(wantUpdates && email) {
      await fetch("/api/save-lead", {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify({anonymous_id:anonymousId, email, xp:user.xp, founder:user.isFounder})
      })
    }
    if(musicRef.current) musicRef.current.volume = 0.3
    speak("Welcome home.")
    setTimeout(onEnterRealOS, 1000)
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="h-screen flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-[#030405] via-[#0A1A2A] to-[#030405]">
      <div className="relative">
        <motion.div animate={{scale:[1,1.15,1]}} transition={{repeat:Infinity, duration:5}} className="w-80 h-80 rounded-full bg-[#FFD700]/15 blur-3xl mb-8"/>
        {user.isFounder && (
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:1, type:"spring"}} className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FFD700]/20 border border-[#FFD700] rounded-full">
            <p className="text-[#FFD700] text-xs">✦ ORIGIN EXPLORER ✦</p>
          </motion.div>
        )}
      </div>
      <h1 className="text-4xl text-[#FFD700]">The Real Door</h1>
      
      <div className="mt-6 p-4 bg-[#0A1A2A]/50 rounded-2xl max-w-md">
        <p className="text-sm text-[#E8F0FF]/60">Your Journey</p>
        <div className="flex justify-around mt-2">
          <div><p className="text-2xl text-[#00D4FF]">{user.hours.toFixed(1)}</p><p className="text-xs">Hours</p></div>
          <div><p className="text-2xl text-[#00FFA3]">{user.xp}</p><p className="text-xs">XP</p></div>
          <div><p className="text-2xl text-[#FFD700]">{user.insight}</p><p className="text-xs">Insight</p></div>
        </div>
      </div>

      <div className="w-96 h-2 bg-[#0A1A2A] rounded-full mt-8 overflow-hidden">
        <motion.div style={{width:`${progress}%`}} className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FFA3] rounded-full"/>
      </div>
      <p className="text-sm mt-2 text-[#00FFA3]">Synthesizing your world... {Math.floor(progress)}%</p>

      {progress>=100 && (
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="mt-8 p-6 bg-[#0A1A2A]/60 rounded-2xl max-w-lg">
          <p className="text-[#E8F0FF]">Would you like to stay connected, Explorer?</p>
          <label className="flex items-center gap-3 mt-4 cursor-pointer justify-center">
            <input type="checkbox" checked={wantUpdates} onChange={e=>setWantUpdates(e.target.checked)} className="w-5 h-5 accent-[#00FFA3]"/>
            <span className="text-sm">Yes, send me updates</span>
          </label>
          {wantUpdates && <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your email" className="mt-3 w-full p-3 bg-[#030405] border-[#00D4FF]/30 rounded-lg text-center"/>}
          <button onClick={handleEnter} className="mt-6 px-12 py-4 bg-[#FFD700]/20 border-2 border-[#FFD700] text-[#FFD700] rounded-lg text-xl hover:bg-[#FFD700]/30 transition">
            Step Through
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

function RealXiantronOS({user, purchase, isOwned, deleteAll}) {
  const [tab, setTab] = useState("home")
  const myCode = localStorage.getItem("xiantron_id")?.slice(0,8)

  return (
    <div className="h-screen p-8 overflow-y-auto">
      <h1 className="text-4xl text-[#00D4FF]">XiantronOS</h1>
      <div className="flex gap-4 mt-6">
        {["home","archive","create","settings"].map(t=>
          <button key={t} onClick={()=>setTab(t)} className="px-4 py-2 bg-[#0A1A2A] rounded">{t}</button>
        )}
      </div>

      {tab==="home" && <div className="mt-8 grid-cols-3 gap-6">
        <div className="p-6 bg-[#0A1A2A]/60 rounded-2xl">XP: {user.xp}</div>
        <div className="p-6 bg-[#0A1A2A]/60 rounded-2xl">Insight: {user.insight}</div>
        <div className="p-6 bg-[#0A1A2A]/60 rounded-2xl">Hours: {user.hours.toFixed(1)}</div>
      </div>}

      {tab==="archive" && <div className="mt-8">
        <h2 className="text-2xl text-[#FFD700]">The Archive</h2>
        {PLUGINS.map(p => (
          <div key={p.id} className="flex justify-between p-4 mt-3 bg-[#0A1A2A]/60 rounded">
            <div><p>{p.name}</p><p className="text-xs">{p.type}</p></div>
            {!isOwned(p.id) && <button onClick={()=>purchase(p)} className="px-4 py-2 bg-[#FFD700]/20 text-[#FFD700] rounded">
              ${user.isFounder? p.founderPrice : p.price}
            </button>}
          </div>
        ))}
      </div>}

      {tab==="settings" && <div className="mt-8">
        <h2>Privacy & Data</h2>
        <p className="text-xs">Your Code: {myCode}</p>
        <button onClick={deleteAll} className="mt-4 px-6 py-3 bg-red-500/20 text-red-400 rounded">Delete All Data</button>
      </div>}
    </div>
  )
}

// ===== MAIN APP =====
export default function Page() {
  const [phase, setPhase] = useState("intro") // intro -> game -> real_door -> real_os
  const [user, setUser] = useState({xp:0, trust:0, hours:0, insight:0, owned:[], isFounder:false})
  
  const {consent, giveConsent, deleteAll, anonymousId} = usePrivacy()
  const log = useTelemetry(consent, anonymousId)
  useSave(user, setUser, consent, anonymousId)
  const {purchase, isOwned} = useArchivePurchases(user, setUser, consent, log)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if(params.get("success")) {
      // In real app: fetch /api/get-purchases and update user.owned
      setUser(u=>({...u, owned:[...u.owned, "theme_nebula"]})) // demo
    }
  }, [])

  useEffect(() => {
    if(user.trust > 150 && user.hours > 5 && phase === "game") {
      log("game_completed")
      setPhase("real_door")
    }
  }, [user, phase, log])

  return (
    <div style={{background:COLORS.bg}} className="h-screen w-screen text-[#E8F0FF]">
      <Particles init={loadSlim} options={{particles:{number:30,color:COLORS.cyan,opacity:0.1,move:{speed:0.1}}}} className="absolute inset-0 -z-10"/>

      {phase==="intro" && <Intro consent={consent} giveConsent={giveConsent} onStart={()=>setPhase("game")}/>}
      {phase==="game" && <Game user={user} setUser={setUser} log={log} purchase={purchase} isOwned={isOwned}/>}
      {phase==="real_door" && <RealDoor user={{...user, id:anonymousId}} onEnterRealOS={()=>setPhase("real_os")} log={log} anonymousId={anonymousId}/>}
      {phase==="real_os" && <RealXiantronOS user={user} purchase={purchase} isOwned={isOwned} deleteAll={deleteAll}/>}
    </div>
  )
}
