const garis = "════════════════"
const nomorku = "628119001453"
const ubah = "```"

function help() {
    return `
*SANKYU BOT*

${ubah}OWNER : https://wa.me/${nomorku}${ubah}
╔══✪ *MENU*
║
╠➥ MENU OWNER BOT: #OWNERMENU
╠➥ MENU ADMIN GROUP: #ADMINMENU
║
╠➥ MENU GROUP = #MENU GR
╠➥ MENU MEDIA = #MENU MD
╠➥ MENU MAKER = #MENU MK
╠➥ MENU GAME = #MENU GM
╠➥ MENU SEARCH = #MENU SC
╠➥ MENU ANIME = #MENU AN
╠➥ MENU OTHER = #MENU OT
║
╚══✪${garis}`
}

function menuowner() {
  return `${garis}
  ╔══✪ *MENU OWNER*
  ║
  ║${garis}
  ║${ubah}OWNER : https://wa.me/${nomorku}${ubah}
  ║${garis}
  ║
  ╠➥ #creategroup [nama]
  ╠➥ #culik
  ╠➥ #setprofilepic
  ╠➥ #setname
  ╠➥ #setstatus
  ╠➥ #bc [teks] 
  ╠➥ #leaveall 
  ╠➥ #clearall 
  ╠➥ #reg 6281289xxxx
  ╠➥ #listdaftar
  ╠➥ #listblock 
  ╠➥ #listprem
  ╠➥ #listgroup
  ╠➥ #getses 
  ╠➥ #mute 
  ╠➥ #unmute 
  ║
  ╚═✪〘 SANKYU BOT 〙
  ${garis}`
}

function menuadmin(){
  return` ${garis}
  ╔══✪ *MENU ADMIN*
  ║
  ║${garis}
  ║${ubah}GUNAKAN DENGAN BIJAK SEBAGAI ADMIN${ubah}
  ║${garis}
  ║
  ╠➥ #join 
  ╠➥ #setgroupname
  ╠➥ #setgroupicon
  ╠➥ #mute
  ╠➥ #unmute
  ╠➥ #tagall
  ╠➥ #add 6281289xxxx
  ╠➥ #kick @tag
  ╠➥ #promote @tag
  ╠➥ #demote @tag
  ╠➥ #ban 62812xxxx
  ╠➥ #unban 62812xxxx
  ╠➥ #leave [bot out]
  ╠➥ #delete [replyChatBot]
  ╠➥ #intro [enable/disable]
  ╠➥ #left [enable/disable]
  ╠➥ #welcome [enable/disable]
  ║
  ╚═✪〘 SANKYU BOT 〙
  ${garis}
  `
}

function gr(){
  return`${garis}
  ╔══✪ *GROUP*
  ║
  ║${garis}
  ╠➥ #groupinfo
  ╠➥ #linkgroup
  ╠➥ #tagall
  ╠➥ #adminList
  ╠➥ #ownerGroup
  ╠➥ #listblock
  ╠➥ #sankyuadmin
  ╠➥ #afk [alasan]
  ╠➥ #delete [replyChatBot]
  ║
  ╚══✪〘 SANKYU BOT 〙
  ${garis}`
}
function md(){
  return`
  ╔══✪ *MEDIA*
  ║
  ║${garis}
  ╠➥ #profile
  ╠➥ #covid [negara]
  ╠➥ #covidindo
  ╠➥ #maps [lokasi]
  ╠➥ #pantun
  ╠➥ #fakta
  ╠➥ #katabijak
  ╠➥ #Quran [Nomor ayat]
  ╠➥ #cuaca [tempat]
  ╠➥ #tts [kode bhs] [teks]
  ╠➥ #berita
  ╠➥ #toimg
  ╠➥ #stiker
  ╠➥ #stickergif
  ║
  ╚══✪〘 SANKYU BOT 〙
  ${garis}`
}
function mk(){
  return`
  ╔══✪ *MAKER*
  ║
  ║${garis}
  ╠➥ #quotemaker [teks|teks|random]
  ╠➥ #alay [teks]
  ╠➥ #nulis [teks]
  ╠➥ #qrcode [optional]
  ╠➥ #tosticker
  ╠➥ #esticker
  ║
  ╚══✪〘 SANKYU BOT 〙
  ${garis}`
}
function gm(){
  return`
  ╔══✪ *GAME*
  ║
  ║${garis}
  ╠➥ #caklontong
  ╠➥ #nomorhoki 62812xxxx
  ╠➥ #family100
  ╠➥ #artimimpi
  ╠➥ #tebakgambar
  ║
  ╚══✪〘 SANKYU BOT 〙`
}
function sc(){
  return`${garis}
  ╔══✪ *SEARCH*
  ║
  ║${garis}
  ╠➥ #movie [judul]
  ╠➥ #images [query]
  ╠➥ #sreddit [query]
  ╠➥ #kbbi [texs]
  ╠➥ #wiki [query]
  ╠➥ #translate [bahasa] [teks]
  ╠➥ #brainly [pertanyaan] [.jumlah]
  ╠➥ #lirik [optional]
  ╠➥ #chord [optional]
  ╠➥ #resep [optional]
  ╠➥ #pinterest
  ╠➥ #google [ [teks] [website]
  ╠➥ #search [query]
  ╠➥ #zodiak
  ║
  ╚══✪〘 SANKYU BOT 〙
  ${garis}`
}
function an(){
  return`${garis}
  ╔══✪ *ANIME*
  ║
  ║${garis}
  ╠➥ #loli
  ╠➥ #anime
  ╠➥ #shota
  ╠➥ #husbu
  ╠➥ #quotesnime
  ╠➥ #wallanime
  ╠➥ #wait
  ╠➥ #malanime [optional]
  ║
  ╚══✪〘 SANKYU BOT 〙
  ${garis}`
}
function ot(){
  return`${garis}
  ╔══✪ *OTHER*
  ║
  ║${garis}
  ╠➥ #runtime
  ╠➥ #ping
  ╠➥ #speed
  ╠➥ #owner
  ║
  ╚══✪〘 SANKYU BOT 〙
  ${garis}`
}




exports.help = help()
exports.gr = gr()
exports.md = md()
exports.mk = mk()
exports.gm = gm()
exports.sc = sc()
exports.an = an()
exports.ot = ot()
exports.menuowner = menuowner()
exports.menuadmin = menuadmin()