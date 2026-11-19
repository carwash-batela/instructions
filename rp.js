/* Prijava kvara – tekstovi (hr|en|de|pl|it|fr). Osoblje dobiva obavijest uvijek na hrvatskom. */
(function(){
var L=['hr','en','de','pl','it','fr'];
function T(s){var a=s.split('|'),o={};L.forEach(function(l,i){o[l]=a[i]});return o}
window.RP={
 L:L,
 NTFY_TOPIC:window.LOC.ntfy,
 NOTIFY_EMAIL:'carwash.batela@gmail.com',
 ui:{
  btn:T('Prijavi kvar|Report a fault|Störung melden|Zgłoś awarię|Segnala guasto|Signaler une panne'),
  title:T('Prijavi kvar|Report a fault|Störung melden|Zgłoś awarię|Segnala un guasto|Signaler une panne'),
  sub:T('Anonimno je i traje manje od minute. Ne unosite osobne podatke.|It is anonymous and takes under a minute. Please do not enter personal data.|Anonym und in unter einer Minute erledigt. Bitte keine persönlichen Daten eingeben.|Anonimowo i zajmuje mniej niż minutę. Nie podawaj danych osobowych.|È anonimo e richiede meno di un minuto. Non inserire dati personali.|C’est anonyme et cela prend moins d’une minute. Ne saisissez aucune donnée personnelle.'),
  q1:T('Na čemu je problem?|What has the problem?|Wo liegt das Problem?|Gdzie jest problem?|Dove si trova il problema?|Où est le problème ?'),
  boxNo:T('Broj boxa|Bay number|Boxnummer|Numer boksu|Numero del box|Numéro du box'),
  vacNo:T('Broj usisavača|Vacuum cleaner number|Staubsaugernummer|Numer odkurzacza|Numero aspirapolvere|Numéro d’aspirateur'),
  which:T('Koji uređaj?|Which device?|Welches Gerät?|Które urządzenie?|Quale dispositivo?|Quel appareil ?'),
  problem:T('Što je problem?|What is the problem?|Was ist das Problem?|Jaki jest problem?|Qual è il problema?|Quel est le problème ?'),
  choose:T('Odaberite…|Choose…|Bitte wählen…|Wybierz…|Seleziona…|Choisir…'),
  note:T('Dodatni opis (nije obavezno)|Additional details (optional)|Zusätzliche Angaben (optional)|Dodatkowy opis (opcjonalnie)|Dettagli aggiuntivi (facoltativo)|Détails supplémentaires (facultatif)'),
  send:T('Pošalji prijavu|Send report|Meldung senden|Wyślij zgłoszenie|Invia segnalazione|Envoyer le signalement'),
  check:T('Provjerite prijavu|Check your report|Meldung prüfen|Sprawdź zgłoszenie|Controlla la segnalazione|Vérifiez le signalement'),
  checkS:T('Ako je sve točno, pritisnite Potvrdi.|If everything is correct, press Confirm.|Wenn alles stimmt, drücken Sie Bestätigen.|Jeśli wszystko się zgadza, naciśnij Potwierdź.|Se è tutto corretto, premi Conferma.|Si tout est correct, appuyez sur Confirmer.'),
  confirm:T('Potvrdi|Confirm|Bestätigen|Potwierdź|Conferma|Confirmer'),
  back:T('Natrag|Back|Zurück|Wstecz|Indietro|Retour'),
  change:T('Promijeni uređaj|Change device|Gerät ändern|Zmień urządzenie|Cambia dispositivo|Changer d’appareil'),
  sending:T('Šaljem…|Sending…|Wird gesendet…|Wysyłanie…|Invio…|Envoi…'),
  err:T('Slanje nije uspjelo. Provjerite internet i pokušajte ponovno.|Sending failed. Check your internet and try again.|Senden fehlgeschlagen. Prüfen Sie Ihr Internet und versuchen Sie es erneut.|Wysyłanie nie powiodło się. Sprawdź internet i spróbuj ponownie.|Invio non riuscito. Controlla internet e riprova.|L’envoi a échoué. Vérifiez votre connexion et réessayez.'),
  wait:T('Prijava je upravo poslana. Pričekajte minutu prije nove.|A report was just sent. Please wait a minute before sending another.|Eine Meldung wurde gerade gesendet. Bitte warten Sie eine Minute.|Zgłoszenie właśnie wysłano. Poczekaj minutę.|Una segnalazione è appena stata inviata. Attendi un minuto.|Un signalement vient d’être envoyé. Attendez une minute.'),
  device:T('Uređaj|Device|Gerät|Urządzenie|Dispositivo|Appareil'),
  prob:T('Problem|Problem|Problem|Problem|Problema|Problème'),
  thanks:T('ZAHVALJUJEMO NA PRIJAVI KVARA I PROBLEMA|THANK YOU FOR REPORTING THE FAULT OR PROBLEM|VIELEN DANK FÜR DIE MELDUNG DER STÖRUNG ODER DES PROBLEMS|DZIĘKUJEMY ZA ZGŁOSZENIE AWARII I PROBLEMU|GRAZIE PER LA SEGNALAZIONE DEL GUASTO O DEL PROBLEMA|MERCI D’AVOIR SIGNALÉ LA PANNE OU LE PROBLÈME'),
  thanksT:T('Naš tim je obaviješten i riješit će problem što prije.|Our team has been notified and will fix the problem as soon as possible.|Unser Team wurde benachrichtigt und behebt das Problem so schnell wie möglich.|Nasz zespół został powiadomiony i jak najszybciej usunie problem.|Il nostro team è stato avvisato e risolverà il problema al più presto.|Notre équipe a été prévenue et réglera le problème au plus vite.'),
  test:T('Ovo je testna faza. U budućnosti razvijamo mogućnost da vam povratimo novac ili žetone.|This is a test phase. We are developing a way to refund your money or tokens in the future.|Dies ist eine Testphase. Wir entwickeln für die Zukunft eine Möglichkeit, Ihr Geld oder Ihre Token zu erstatten.|To faza testowa. Pracujemy nad możliwością zwrotu pieniędzy lub żetonów w przyszłości.|Questa è una fase di test. Stiamo sviluppando la possibilità di rimborsare denaro o gettoni in futuro.|Ceci est une phase de test. Nous développons la possibilité de rembourser votre argent ou vos jetons à l’avenir.'),
  home:T('Natrag na upute|Back to instructions|Zurück zur Anleitung|Wróć do instrukcji|Torna alle istruzioni|Retour aux instructions'),
  mapBtn:T('Ne znam gdje je uređaj – odaberi na karti|Not sure where the device is – pick it on the map|Sie wissen nicht, wo das Gerät steht – auf der Karte wählen|Nie wiesz, gdzie jest urządzenie – wybierz na mapie|Non sai dov’è il dispositivo – scegli sulla mappa|Vous ne savez pas où est l’appareil – choisissez sur la carte'),
  mapOr:T('ili|or|oder|lub|oppure|ou'),
  mapTitle:T('Gdje se nalazi uređaj?|Where is the device?|Wo steht das Gerät?|Gdzie jest urządzenie?|Dov’è il dispositivo?|Où se trouve l’appareil ?'),
  mapSub:T('Dodirnite obojeno područje na karti, a zatim odaberite uređaj.|Tap a coloured area on the map, then choose the device.|Tippen Sie auf einen farbigen Bereich der Karte und wählen Sie dann das Gerät.|Dotknij kolorowego obszaru na mapie, a potem wybierz urządzenie.|Tocca un’area colorata sulla mappa, poi scegli il dispositivo.|Touchez une zone colorée de la carte, puis choisissez l’appareil.'),
  mapAria:T('Karta autopraonice|Car wash map|Karte der Waschanlage|Mapa myjni|Mappa dell’autolavaggio|Plan du lavage auto'),
  mapPick:T('Odaberite uređaj u ovom području:|Choose the device in this area:|Wählen Sie das Gerät in diesem Bereich:|Wybierz urządzenie w tym obszarze:|Scegli il dispositivo in quest’area:|Choisissez l’appareil dans cette zone :'),
  mapList:T('Ne vidite uređaj? Odaberite ga s popisa|Can’t see your device? Choose it from the list|Gerät nicht dabei? Aus der Liste wählen|Nie widzisz urządzenia? Wybierz z listy|Non vedi il dispositivo? Scegli dall’elenco|Vous ne voyez pas l’appareil ? Choisissez dans la liste')
 },
 dev:{
  changer:T('Mjenjač novca|Money changer|Geldwechsler|Wymieniarka pieniędzy|Cambiamonete|Changeur de monnaie'),
  boxes:T('Boxevi|Wash bays|Waschboxen|Boksy|Box di lavaggio|Boxes de lavage'),
  vacuum:T('Usisavači|Vacuum cleaners|Staubsauger|Odkurzacze|Aspirapolvere|Aspirateurs'),
  cloths:T('Krpe|Cloths|Tücher|Ściereczki|Panni|Chiffons'),
  other:T('Ostali uređaji|Other devices|Weitere Geräte|Inne urządzenia|Altri dispositivi|Autres appareils'),
  gloss:T('Sjajilo za gume|Tire gloss|Reifenglanz|Połysk do opon|Lucidante per pneumatici|Brillant pour pneus'),
  scent:T('Miris za auto|Car air freshener|Autoduft|Zapach do auta|Profumo per auto|Désodorisant auto'),
  carpet:T('Pranje tepiha|Carpet cleaning|Teppichreinigung|Czyszczenie dywaników|Pulizia tappetini|Nettoyage des tapis'),
  deep:T('Dubinsko čišćenje|Deep cleaning|Tiefenreinigung|Głębokie czyszczenie|Pulizia profonda|Nettoyage en profondeur')
 },
 grp:{
  tech:T('Tehnički problemi|Technical problems|Technische Probleme|Problemy techniczne|Problemi tecnici|Problèmes techniques'),
  mech:T('Mehanički problemi|Mechanical problems|Mechanische Probleme|Problemy mechaniczne|Problemi meccanici|Problèmes mécaniques')
 },
 p:{
  noTokens:T('Ne izbacuje žetone|Does not dispense tokens|Gibt keine Token aus|Nie wydaje żetonów|Non eroga gettoni|Ne distribue pas de jetons'),
  swMoney:T('Progutao novac|Swallowed my money|Hat mein Geld verschluckt|Połknął pieniądze|Ha inghiottito i soldi|A avalé mon argent'),
  noMoney:T('Ne prima novac|Does not accept money|Nimmt kein Geld an|Nie przyjmuje pieniędzy|Non accetta denaro|N’accepte pas l’argent'),
  card:T('Kartično plaćanje ne radi|Card payment not working|Kartenzahlung funktioniert nicht|Płatność kartą nie działa|Il pagamento con carta non funziona|Le paiement par carte ne fonctionne pas'),
  swCoin:T('Progutao kovanice ili žeton|Swallowed coins or token|Hat Münzen oder Token verschluckt|Połknął monety lub żeton|Ha inghiottito monete o gettone|A avalé des pièces ou un jeton'),
  noCoin:T('Ne prima kovanice ili žeton|Does not accept coins or token|Nimmt keine Münzen oder Token an|Nie przyjmuje monet ani żetonu|Non accetta monete o gettone|N’accepte pas les pièces ou le jeton'),
  err5:T('Piše Err5|Shows Err5|Zeigt Err5|Wyświetla Err5|Mostra Err5|Affiche Err5'),
  errC:T('Piše ErrC|Shows ErrC|Zeigt ErrC|Wyświetla ErrC|Mostra ErrC|Affiche ErrC'),
  btn:T('Tipkalo ne reagira|Button does not respond|Taste reagiert nicht|Przycisk nie reaguje|Il pulsante non risponde|Le bouton ne répond pas'),
  hose:T('Puklo crijevo|Burst hose|Schlauch geplatzt|Pęknięty wąż|Tubo rotto|Tuyau éclaté'),
  gun:T('Slomljena prskalica|Broken spray gun|Spritzpistole kaputt|Zepsuty pistolet|Pistola rotta|Pistolet cassé'),
  noFoam:T('Nema pjene|No foam|Kein Schaum|Brak piany|Niente schiuma|Pas de mousse'),
  noWax:T('Nema voska|No wax|Kein Wachs|Brak wosku|Niente cera|Pas de cire'),
  shake:T('Trese se u ruci|Shakes in the hand|Zittert in der Hand|Drży w ręku|Trema in mano|Vibre dans la main'),
  weakP:T('Slab pritisak|Weak pressure|Schwacher Druck|Słabe ciśnienie|Pressione debole|Faible pression'),
  weakS:T('Slabo vuče|Weak suction|Saugt schwach|Słabo ssie|Aspira poco|Aspire faiblement'),
  clog:T('Začepljen|Clogged|Verstopft|Zatkany|Intasato|Bouché'),
  nozzle:T('Slomljen nastavak za crijevo|Broken hose attachment|Schlauchaufsatz kaputt|Zepsuta końcówka węża|Attacco del tubo rotto|Embout du tuyau cassé'),
  noCloth:T('Nije izbacilo krpu|Cloth was not dispensed|Tuch wurde nicht ausgegeben|Nie wydało ściereczki|Il panno non è uscito|Le chiffon n’est pas sorti'),
  redLamp:T('Svijetli crvena lampica|A red light is on|Eine rote Lampe leuchtet|Świeci się czerwona lampka|Si accende una spia rossa|Un voyant rouge est allumé'),
  noLiquid:T('Aparat ne izbacuje tekućinu|Machine does not dispense liquid|Gerät gibt keine Flüssigkeit aus|Urządzenie nie dozuje płynu|La macchina non eroga liquido|L’appareil ne distribue pas de liquide')
 },
 /* Karta: točke poligona su u pikselima slike assets/map.jpg (624×912). ~ = prijelom retka u oznaci */
 map:{
  w:624,h:912,img:'assets/map.jpg',
  zones:{
   z1:{col:'#4aa82b',pill:'#2e7d1c',pts:[[89,222],[37,549],[100,560],[153,232]],at:[92,330],vac:[1,2,3],other:['gloss'],
    t:T('Usisavači 1–3~+ sjajilo|Vacuums 1–3~+ tire gloss|Staubsauger 1–3~+ Reifenglanz|Odkurzacze 1–3~+ połysk opon|Aspirapolvere 1–3~+ lucidante|Aspirateurs 1–3~+ brillant')},
   z2:{col:'#17607f',pill:'#14587a',pts:[[81,733],[220,780],[423,188],[284,140]],at:[218,560],box:[1,2,3,4,5,6,7,8,9],
    t:T('Boxevi~1–9|Wash bays~1–9|Waschboxen~1–9|Boksy~1–9|Box di lavaggio~1–9|Boxes de lavage~1–9')},
   z3:{col:'#ea7132',pill:'#b8500f',pts:[[260,870],[342,898],[420,669],[339,641]],at:[340,769],vac:[4,5,6],
    t:T('Usisavači~4–6|Vacuums~4–6|Staubsauger~4–6|Odkurzacze~4–6|Aspirapolvere~4–6|Aspirateurs~4–6')},
   z4:{col:'#a02b93',pill:'#862079',pts:[[459,132],[428,208],[487,284],[452,460],[503,480],[551,356],[560,241],[532,181]],at:[494,300],vac:[7,8,9,10],other:['scent','deep'],
    t:T('Usisavači 7–10~+ miris, dubinsko|Vacuums 7–10~+ scent, deep clean|Staubsauger 7–10~+ Duft, Tiefenrein.|Odkurzacze 7–10~+ zapach, głębokie|Aspirapolvere 7–10~+ profumo, profonda|Aspirateurs 7–10~+ parfum, profond')}
  }
 },
 /* koji problemi pripadaju kojem uređaju; objekt = grupe, niz = jednostavan popis */
 probs:{
  changer:['noTokens','swMoney','noMoney','card'],
  boxes:{tech:['swCoin','noCoin','err5','errC','btn'],mech:['hose','gun','noFoam','noWax','shake','weakP']},
  vacuum:['noCoin','weakS','clog','nozzle','hose'],
  cloths:['noCoin','noCloth','redLamp'],
  other:['noCoin','noLiquid','hose'],
  gloss:['noCoin','noLiquid','hose']
 }
};
})();
