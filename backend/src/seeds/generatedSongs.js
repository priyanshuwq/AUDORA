import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songs = [
  {
    "title": "Tango For Taj",
    "artist": "A.R. Rahman",
    "imageUrl": "/extracted-covers/a_r__rahman___tango_for_taj_cover.jpeg",
    "audioUrl": "/songs/A.R. Rahman - Tango For Taj.mp3",
    "duration": 179
  },
  {
    "title": "The Dichotomy Of Fame",
    "artist": "A.R. Rahman",
    "imageUrl": "/extracted-covers/a_r__rahman___the_dichotomy_of_fame_cover.jpeg",
    "audioUrl": "/songs/A.R. Rahman - The Dichotomy Of Fame.mp3",
    "duration": 161
  },
  {
    "title": "Tere Bina",
    "artist": "A.R. Rahman",
    "imageUrl": "/extracted-covers/a_r__rahman__chinmayi__murtuza_khan__qadir_khan___tere_bina_cover.jpeg",
    "audioUrl": "/songs/A.R. Rahman, Chinmayi, Murtuza Khan, Qadir Khan - Tere Bina.mp3",
    "duration": 310
  },
  {
    "title": "Luka Chuppi",
    "artist": "A.R. Rahman",
    "imageUrl": "/extracted-covers/a_r__rahman__lata_mangeshkar___luka_chuppi_cover.jpeg",
    "audioUrl": "/songs/A.R. Rahman, Lata Mangeshkar - Luka Chuppi.mp3",
    "duration": 397
  },
  {
    "title": "Nadaan Parinde",
    "artist": "A.R. Rahman",
    "imageUrl": "/extracted-covers/a_r__rahman__mohit_chauhan___nadaan_parinde_cover.jpeg",
    "audioUrl": "/songs/A.R. Rahman, Mohit Chauhan - Nadaan Parinde.mp3",
    "duration": 384
  },
  {
    "title": "Challa",
    "artist": "A.R. Rahman",
    "imageUrl": "/extracted-covers/a_r__rahman__rabbi__gulzar___challa_cover.jpeg",
    "audioUrl": "/songs/A.R. Rahman, Rabbi, Gulzar - Challa.mp3",
    "duration": 320
  },
  {
    "title": "Thodi Si Daaru",
    "artist": "AP Dhillon",
    "imageUrl": "/extracted-covers/ap_dhillon__shreya_ghoshal___thodi_si_daaru_cover.jpeg",
    "audioUrl": "/songs/AP Dhillon, Shreya Ghoshal - Thodi Si Daaru.mp3",
    "duration": 180
  },
  {
    "title": "Kamariya",
    "artist": "Aastha Gill",
    "imageUrl": "/extracted-covers/aastha_gill__sachin_sanghvi__jigar_saraiya__divya_kumar___kamariya_cover.jpeg",
    "audioUrl": "/songs/Aastha Gill, Sachin Sanghvi, Jigar Saraiya, Divya Kumar - Kamariya.mp3",
    "duration": 188
  },
  {
    "title": "Dil Kaa Jo Haal Hai",
    "artist": "Abhijeet",
    "imageUrl": "/extracted-covers/abhijeet__shreya_ghoshal___dil_kaa_jo_haal_hai_cover.jpeg",
    "audioUrl": "/songs/Abhijeet, Shreya Ghoshal - Dil Kaa Jo Haal Hai.mp3",
    "duration": 303
  },
  {
    "title": "Skyfall",
    "artist": "Adele",
    "imageUrl": "/extracted-covers/adele___skyfall_cover.jpeg",
    "audioUrl": "/songs/Adele - Skyfall.mp3",
    "duration": 287
  },
  {
    "title": "Awaargi",
    "artist": "Aditya A",
    "imageUrl": "/extracted-covers/aditya_a___awaargi_cover.jpeg",
    "audioUrl": "/songs/Aditya A - Awaargi.mp3",
    "duration": 62
  },
  {
    "title": "Chaand Baaliyan",
    "artist": "Aditya A",
    "imageUrl": "/extracted-covers/aditya_a___chaand_baaliyan_cover.jpeg",
    "audioUrl": "/songs/Aditya A - Chaand Baaliyan.mp3",
    "duration": 103
  },
  {
    "title": "Sahiba",
    "artist": "Aditya Rikhari",
    "imageUrl": "/extracted-covers/aditya_rikhari___sahiba_cover.jpeg",
    "audioUrl": "/songs/Aditya Rikhari - Sahiba.mp3",
    "duration": 190
  },
  {
    "title": "Zingaat",
    "artist": "Ajay-Atul",
    "imageUrl": "/extracted-covers/ajay_atul___zingaat_cover.jpeg",
    "audioUrl": "/songs/Ajay-Atul - Zingaat.mp3",
    "duration": 227
  },
  {
    "title": "Mera Naam Mary (From \"Brothers\")",
    "artist": "Ajay-Atul",
    "imageUrl": "/extracted-covers/ajay_atul__chinmayi___mera_naam_mary__from__brothers___cover.jpeg",
    "audioUrl": "/songs/Ajay-Atul, Chinmayi - Mera Naam Mary (From 'Brothers').mp3",
    "duration": 311
  },
  {
    "title": "Tera Ban Jaunga",
    "artist": "Akhil Sachdeva",
    "imageUrl": "/extracted-covers/akhil_sachdeva__tulsi_kumar__kumaar___tera_ban_jaunga_cover.jpeg",
    "audioUrl": "/songs/Akhil Sachdeva, Tulsi Kumar, Kumaar - Tera Ban Jaunga.mp3",
    "duration": 236
  },
  {
    "title": "Duniyaa (From \"Luka Chuppi\")",
    "artist": "Akhil",
    "imageUrl": "/extracted-covers/akhil__dhvani_bhanushali__kunaal_vermaa__abhijit_vaghani___duniyaa__from__luka_chuppi___cover.jpeg",
    "audioUrl": "/songs/Akhil, Dhvani Bhanushali, Kunaal Vermaa, Abhijit Vaghani - Duniyaa (From 'Luka Chuppi').mp3",
    "duration": 223
  },
  {
    "title": "Agar Tum Saath Ho",
    "artist": "Alka Yagnik",
    "imageUrl": "/extracted-covers/alka_yagnik__arijit_singh___agar_tum_saath_ho_cover.jpeg",
    "audioUrl": "/songs/Alka Yagnik, Arijit Singh - Agar Tum Saath Ho.mp3",
    "duration": 341
  },
  {
    "title": "Chaleya (From \"Jawan\")",
    "artist": "Anirudh Ravichander",
    "imageUrl": "/extracted-covers/anirudh_ravichander__arijit_singh__shilpa_rao__kumaar___chaleya__from__jawan___cover.jpeg",
    "audioUrl": "/songs/Anirudh Ravichander, Arijit Singh, Shilpa Rao, Kumaar - Chaleya (From 'Jawan').mp3",
    "duration": 200
  },
  {
    "title": "Sunn Raha Hai (Male Version)",
    "artist": "Ankit Tiwari",
    "imageUrl": "/extracted-covers/ankit_tiwari___sunn_raha_hai__male_version__cover.jpeg",
    "audioUrl": "/songs/Ankit Tiwari - Sunn Raha Hai (Male Version).mp3",
    "duration": 390
  },
  {
    "title": "Lamhey",
    "artist": "Anubha Bajaj",
    "imageUrl": "/extracted-covers/anubha_bajaj___lamhey_cover.jpeg",
    "audioUrl": "/songs/Anubha Bajaj - Lamhey.mp3",
    "duration": 149
  },
  {
    "title": "Ishq Hai",
    "artist": "Anurag Saikia",
    "imageUrl": "/extracted-covers/anurag_saikia__raj_shekhar__romy__amarabha_banerjee__varun_jain__madhubanti_bagchi__mismatched___cast___ishq_hai_cover.jpeg",
    "audioUrl": "/songs/Anurag Saikia, Raj Shekhar, Romy, Amarabha Banerjee, Varun Jain, Madhubanti Bagchi, Mismatched - Cast - Ishq Hai.mp3",
    "duration": 313
  },
  {
    "title": "Alag Aasmaan",
    "artist": "Anuv Jain",
    "imageUrl": "/extracted-covers/anuv_jain___alag_aasmaan_cover.jpeg",
    "audioUrl": "/songs/Anuv Jain - Alag Aasmaan.mp3",
    "duration": 213
  },
  {
    "title": "Baarishein",
    "artist": "Anuv Jain",
    "imageUrl": "/extracted-covers/anuv_jain___baarishein_cover.jpeg",
    "audioUrl": "/songs/Anuv Jain - Baarishein.mp3",
    "duration": 207
  },
  {
    "title": "Gul",
    "artist": "Anuv Jain",
    "imageUrl": "/extracted-covers/anuv_jain___gul_cover.jpeg",
    "audioUrl": "/songs/Anuv Jain - Gul.mp3",
    "duration": 217
  },
  {
    "title": "Kudiye Ni",
    "artist": "Aparshakti Khurana",
    "imageUrl": "/extracted-covers/aparshakti_khurana__neeti_mohan___kudiye_ni_cover.jpeg",
    "audioUrl": "/songs/Aparshakti Khurana, Neeti Mohan - Kudiye Ni.mp3",
    "duration": 205
  },
  {
    "title": "I Wanna Be Yours",
    "artist": "Arctic Monkeys",
    "imageUrl": "/extracted-covers/arctic_monkeys___i_wanna_be_yours_cover.jpeg",
    "audioUrl": "/songs/Arctic Monkeys - I Wanna Be Yours.mp3",
    "duration": 184
  },
  {
    "title": "Main Dhoondne Ko Zamaane Mein (From \"Heartless\")",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh___main_dhoondne_ko_zamaane_mein__from__heartless___cover.jpeg",
    "audioUrl": "/songs/Arijit Singh - Main Dhoondne Ko Zamaane Mein (From 'Heartless').mp3",
    "duration": 263
  },
  {
    "title": "Main Dhoondne Ko Zamaane Mein",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh___main_dhoondne_ko_zamaane_mein_cover.jpeg",
    "audioUrl": "/songs/Arijit Singh - Main Dhoondne Ko Zamaane Mein.mp3",
    "duration": 263
  },
  {
    "title": "Palat - Tera Hero Idhar Hai (From \"Main Tera Hero\")",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh___palat___tera_hero_idhar_hai__from__main_tera_hero___cover.jpeg",
    "audioUrl": "/songs/Arijit Singh - Palat - Tera Hero Idhar Hai (From 'Main Tera Hero').mp3",
    "duration": 271
  },
  {
    "title": "Uska Hi Banana (From \"1920 Evil Returns\")",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh___uska_hi_banana__from__1920_evil_returns___cover.jpeg",
    "audioUrl": "/songs/Arijit Singh - Uska Hi Banana (From '1920 Evil Returns').mp3",
    "duration": 327
  },
  {
    "title": "Mast Magan (From \"2 States\")",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh__chinmayi___mast_magan__from__2_states___cover.jpeg",
    "audioUrl": "/songs/Arijit Singh, Chinmayi - Mast Magan (From '2 States').mp3",
    "duration": 280
  },
  {
    "title": "Mast Magan",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh__chinmayi___mast_magan_cover.jpeg",
    "audioUrl": "/songs/Arijit Singh, Chinmayi - Mast Magan.mp3",
    "duration": 280
  },
  {
    "title": "Zaalima",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh__harshdeep_kaur___zaalima_cover.jpeg",
    "audioUrl": "/songs/Arijit Singh, Harshdeep Kaur - Zaalima.mp3",
    "duration": 299
  },
  {
    "title": "Humdard",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh__mithoon___humdard_cover.jpeg",
    "audioUrl": "/songs/Arijit Singh, Mithoon - Humdard.mp3",
    "duration": 261
  },
  {
    "title": "Tujhe Kitna Chahne Lage (From \"Kabir Singh\")",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh__mithoon___tujhe_kitna_chahne_lage__from__kabir_singh___cover.jpeg",
    "audioUrl": "/songs/Arijit Singh, Mithoon - Tujhe Kitna Chahne Lage (From 'Kabir Singh').mp3",
    "duration": 285
  },
  {
    "title": "Tujhe Kitna Chahne Lage",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh__mithoon___tujhe_kitna_chahne_lage_cover.jpeg",
    "audioUrl": "/songs/Arijit Singh, Mithoon - Tujhe Kitna Chahne Lage.mp3",
    "duration": 285
  },
  {
    "title": "Main Tera Boyfriend (From \"Raabta\")",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh__neha_kakkar__meet_bros____main_tera_boyfriend__from__raabta___cover.jpeg",
    "audioUrl": "/songs/Arijit Singh, Neha Kakkar, Meet Bros. - Main Tera Boyfriend (From 'Raabta').mp3",
    "duration": 276
  },
  {
    "title": "Sajni",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh__ram_sampath__prashant_pandey___sajni_cover.jpeg",
    "audioUrl": "/songs/Arijit Singh, Ram Sampath, Prashant Pandey - Sajni.mp3",
    "duration": 170
  },
  {
    "title": "Satranga (From \"ANIMAL\")",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh__shreyas_puranik__siddharth___garima___satranga__from__animal___cover.jpeg",
    "audioUrl": "/songs/Arijit Singh, Shreyas Puranik, Siddharth - Garima - Satranga (From 'ANIMAL').mp3",
    "duration": 271
  },
  {
    "title": "Satranga",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh__shreyas_puranik__siddharth___garima___satranga_cover.jpeg",
    "audioUrl": "/songs/Arijit Singh, Shreyas Puranik, Siddharth - Garima - Satranga.mp3",
    "duration": 271
  },
  {
    "title": "Dilliwaali Girlfriend",
    "artist": "Arijit Singh",
    "imageUrl": "/extracted-covers/arijit_singh__sunidhi_chauhan___dilliwaali_girlfriend_cover.jpeg",
    "audioUrl": "/songs/Arijit Singh, Sunidhi Chauhan - Dilliwaali Girlfriend.mp3",
    "duration": 261
  },
  {
    "title": "Bol Do Na Zara",
    "artist": "Armaan Malik",
    "imageUrl": "/extracted-covers/armaan_malik___bol_do_na_zara_cover.jpeg",
    "audioUrl": "/songs/Armaan Malik - Bol Do Na Zara.mp3",
    "duration": 293
  },
  {
    "title": "Buttabomma",
    "artist": "Armaan Malik",
    "imageUrl": "/extracted-covers/armaan_malik___buttabomma_cover.jpeg",
    "audioUrl": "/songs/Armaan Malik - Buttabomma.mp3",
    "duration": 199
  },
  {
    "title": "Dil Mein Ho Tum",
    "artist": "Armaan Malik",
    "imageUrl": "/extracted-covers/armaan_malik___dil_mein_ho_tum_cover.jpeg",
    "audioUrl": "/songs/Armaan Malik - Dil Mein Ho Tum.mp3",
    "duration": 327
  },
  {
    "title": "Jab Tak",
    "artist": "Armaan Malik",
    "imageUrl": "/extracted-covers/armaan_malik___jab_tak_cover.jpeg",
    "audioUrl": "/songs/Armaan Malik - Jab Tak.mp3",
    "duration": 174
  },
  {
    "title": "Main Rahoon Ya Na Rahoon",
    "artist": "Armaan Malik",
    "imageUrl": "/extracted-covers/armaan_malik___main_rahoon_ya_na_rahoon_cover.jpeg",
    "audioUrl": "/songs/Armaan Malik - Main Rahoon Ya Na Rahoon.mp3",
    "duration": 320
  },
  {
    "title": "Jab Tak",
    "artist": "Armaan Malik",
    "imageUrl": "/extracted-covers/armaan_malik__amaal_mallik__manoj_muntashir___jab_tak_cover.jpeg",
    "audioUrl": "/songs/Armaan Malik, Amaal Mallik, Manoj Muntashir - Jab Tak.mp3",
    "duration": 174
  },
  {
    "title": "Bol Do Na Zara",
    "artist": "Armaan Malik",
    "imageUrl": "/extracted-covers/armaan_malik__amaal_mallik__rashmi_virag___bol_do_na_zara_cover.jpeg",
    "audioUrl": "/songs/Armaan Malik, Amaal Mallik, Rashmi Virag - Bol Do Na Zara.mp3",
    "duration": 293
  },
  {
    "title": "Wajah Tum Ho",
    "artist": "Armaan Malik",
    "imageUrl": "/extracted-covers/armaan_malik__baman__manoj_muntashir___wajah_tum_ho_cover.jpeg",
    "audioUrl": "/songs/Armaan Malik, Baman, Manoj Muntashir - Wajah Tum Ho.mp3",
    "duration": 358
  },
  {
    "title": "Chale Aana",
    "artist": "Armaan Malik",
    "imageUrl": "/extracted-covers/armaan_malik__kunaal_vermaa___chale_aana_cover.jpeg",
    "audioUrl": "/songs/Armaan Malik, Kunaal Vermaa - Chale Aana.mp3",
    "duration": 271
  },
  {
    "title": "Sab Tera",
    "artist": "Armaan Malik",
    "imageUrl": "/extracted-covers/armaan_malik__shraddha_kapoor___sab_tera_cover.jpeg",
    "audioUrl": "/songs/Armaan Malik, Shraddha Kapoor - Sab Tera.mp3",
    "duration": 228
  },
  {
    "title": "Pehla Pyaar",
    "artist": "Armaan Malik",
    "imageUrl": "/extracted-covers/armaan_malik__vishal_mishra__irshad_kamil___pehla_pyaar_cover.jpeg",
    "audioUrl": "/songs/Armaan Malik, Vishal Mishra, Irshad Kamil - Pehla Pyaar.mp3",
    "duration": 273
  },
  {
    "title": "In Ankhon Ki Masti",
    "artist": "Asha Bhosle",
    "imageUrl": "/extracted-covers/asha_bhosle___in_ankhon_ki_masti_cover.jpeg",
    "audioUrl": "/songs/Asha Bhosle - In Ankhon Ki Masti.mp3",
    "duration": 343
  },
  {
    "title": "Zara Sa Jhoom Loon Main",
    "artist": "Asha Bhosle",
    "imageUrl": "/extracted-covers/asha_bhosle__abhijeet___zara_sa_jhoom_loon_main_cover.jpeg",
    "audioUrl": "/songs/Asha Bhosle, Abhijeet - Zara Sa Jhoom Loon Main.mp3",
    "duration": 353
  },
  {
    "title": "Dhoop Mein Nikla Na Karo - From \"Geraftaar\"",
    "artist": "Asha Bhosle",
    "imageUrl": "/extracted-covers/asha_bhosle__kishore_kumar___dhoop_mein_nikla_na_karo___from__geraftaar__cover.jpeg",
    "audioUrl": "/songs/Asha Bhosle, Kishore Kumar - Dhoop Mein Nikla Na Karo - From 'Geraftaar'.mp3",
    "duration": 281
  },
  {
    "title": "Yeh Raaten Yeh Mausam",
    "artist": "Asha Bhosle",
    "imageUrl": "/extracted-covers/asha_bhosle__kishore_kumar__ravi___yeh_raaten_yeh_mausam_cover.jpeg",
    "audioUrl": "/songs/Asha Bhosle, Kishore Kumar, Ravi - Yeh Raaten Yeh Mausam.mp3",
    "duration": 207
  },
  {
    "title": "Intaha Ho Gai Intezar Ki - Remix",
    "artist": "Asha Bhosle",
    "imageUrl": "/extracted-covers/asha_bhosle__kishore_kumar__vaibhav_singh_music___intaha_ho_gai_intezar_ki___remix_cover.jpeg",
    "audioUrl": "/songs/Asha Bhosle, Kishore Kumar, Vaibhav Singh Music - Intaha Ho Gai Intezar Ki - Remix.mp3",
    "duration": 173
  },
  {
    "title": "Abhi Na Jao Chhod Kar",
    "artist": "Asha Bhosle",
    "imageUrl": "/extracted-covers/asha_bhosle__mohammed_rafi___abhi_na_jao_chhod_kar_cover.jpeg",
    "audioUrl": "/songs/Asha Bhosle, Mohammed Rafi - Abhi Na Jao Chhod Kar.mp3",
    "duration": 258
  },
  {
    "title": "Chura Liya Hai Tumne Jo Dil Ko",
    "artist": "Asha Bhosle",
    "imageUrl": "/extracted-covers/asha_bhosle__mohammed_rafi___chura_liya_hai_tumne_jo_dil_ko_cover.jpeg",
    "audioUrl": "/songs/Asha Bhosle, Mohammed Rafi - Chura Liya Hai Tumne Jo Dil Ko.mp3",
    "duration": 288
  },
  {
    "title": "Parda Hata Do",
    "artist": "Asha Bhosle",
    "imageUrl": "/extracted-covers/asha_bhosle__mohammed_rafi___parda_hata_do_cover.jpeg",
    "audioUrl": "/songs/Asha Bhosle, Mohammed Rafi - Parda Hata Do.mp3",
    "duration": 280
  },
  {
    "title": "Chura Liya Hai Tumne Jo Dil Ko",
    "artist": "Asha Bhosle",
    "imageUrl": "/extracted-covers/asha_bhosle__mohammed_rafi__r__d__burman___chura_liya_hai_tumne_jo_dil_ko_cover.jpeg",
    "audioUrl": "/songs/Asha Bhosle, Mohammed Rafi, R. D. Burman - Chura Liya Hai Tumne Jo Dil Ko.mp3",
    "duration": 288
  },
  {
    "title": "Radha Kaise Na Jale",
    "artist": "Asha Bhosle",
    "imageUrl": "/extracted-covers/asha_bhosle__udit_narayan__vaishali_samant__a_r__rahman___radha_kaise_na_jale_cover.jpeg",
    "audioUrl": "/songs/Asha Bhosle, Udit Narayan, Vaishali Samant, A.R. Rahman - Radha Kaise Na Jale.mp3",
    "duration": 335
  },
  {
    "title": "Main Rang Sharbaton Ka",
    "artist": "Atif Aslam",
    "imageUrl": "/extracted-covers/atif_aslam__chinmayi_sripaada__pritam___main_rang_sharbaton_ka_cover.jpeg",
    "audioUrl": "/songs/Atif Aslam, Chinmayi Sripaada, Pritam - Main Rang Sharbaton Ka.mp3",
    "duration": 263
  },
  {
    "title": "Pani Da Rang - Male Vocals",
    "artist": "Ayushmann Khurrana",
    "imageUrl": "/extracted-covers/ayushmann_khurrana__rochak_kohli___pani_da_rang___male_vocals_cover.jpeg",
    "audioUrl": "/songs/Ayushmann Khurrana, Rochak Kohli - Pani Da Rang - Male Vocals.mp3",
    "duration": 239
  },
  {
    "title": "Pani Da Rang - Male",
    "artist": "Ayushmann Khurrana",
    "imageUrl": "/extracted-covers/ayushmann_khurrana__rochak_kohli___pani_da_rang___male_cover.jpeg",
    "audioUrl": "/songs/Ayushmann Khurrana, Rochak Kohli - Pani Da Rang - Male.mp3",
    "duration": 239
  },
  {
    "title": "Mann Bharryaa 2.0 (From \"Shershaah\")",
    "artist": "B Praak",
    "imageUrl": "/extracted-covers/b_praak__jaani___mann_bharryaa_2_0__from__shershaah___cover.jpeg",
    "audioUrl": "/songs/B Praak, Jaani - Mann Bharryaa 2.0 (From 'Shershaah').mp3",
    "duration": 266
  },
  {
    "title": "Butter",
    "artist": "BTS",
    "imageUrl": "/extracted-covers/bts___butter_cover.jpeg",
    "audioUrl": "/songs/BTS - Butter.mp3",
    "duration": 164
  },
  {
    "title": "DNA",
    "artist": "BTS",
    "imageUrl": "/extracted-covers/bts___dna_cover.jpeg",
    "audioUrl": "/songs/BTS - DNA.mp3",
    "duration": 223
  },
  {
    "title": "Dynamite",
    "artist": "BTS",
    "imageUrl": "/extracted-covers/bts___dynamite_cover.jpeg",
    "audioUrl": "/songs/BTS - Dynamite.mp3",
    "duration": 206
  },
  {
    "title": "FAKE LOVE",
    "artist": "BTS",
    "imageUrl": "/extracted-covers/bts___fake_love_cover.jpeg",
    "audioUrl": "/songs/BTS - FAKE LOVE.mp3",
    "duration": 242
  },
  {
    "title": "Not Today",
    "artist": "BTS",
    "imageUrl": "/extracted-covers/bts___not_today_cover.jpeg",
    "audioUrl": "/songs/BTS - Not Today.mp3",
    "duration": 232
  },
  {
    "title": "She Move It Like",
    "artist": "Badshah",
    "imageUrl": "/extracted-covers/badshah___she_move_it_like_cover.jpeg",
    "audioUrl": "/songs/Badshah - She Move It Like.mp3",
    "duration": 182
  },
  {
    "title": "Akh Lad Jaave",
    "artist": "Badshah",
    "imageUrl": "/extracted-covers/badshah__asees_kaur__jubin_nautiyal__tanishk_bagchi___akh_lad_jaave_cover.jpeg",
    "audioUrl": "/songs/Badshah, Asees Kaur, Jubin Nautiyal, Tanishk Bagchi - Akh Lad Jaave.mp3",
    "duration": 180
  },
  {
    "title": "Bang Bang",
    "artist": "Benny Dayal",
    "imageUrl": "/extracted-covers/benny_dayal__neeti_mohan___bang_bang_cover.jpeg",
    "audioUrl": "/songs/Benny Dayal, Neeti Mohan - Bang Bang.mp3",
    "duration": 320
  },
  {
    "title": "Lat Lag Gayee",
    "artist": "Benny Dayal",
    "imageUrl": "/extracted-covers/benny_dayal__shalmali_kholgade__pritam___lat_lag_gayee_cover.jpeg",
    "audioUrl": "/songs/Benny Dayal, Shalmali Kholgade, Pritam - Lat Lag Gayee.mp3",
    "duration": 280
  },
  {
    "title": "Same Beef",
    "artist": "Bohemia",
    "imageUrl": "/extracted-covers/bohemia__sidhu_moose_wala___same_beef_cover.jpeg",
    "audioUrl": "/songs/Bohemia, Sidhu Moose Wala - Same Beef.mp3",
    "duration": 290
  },
  {
    "title": "Can You Feel My Heart",
    "artist": "Bring Me The Horizon",
    "imageUrl": "/extracted-covers/bring_me_the_horizon___can_you_feel_my_heart_cover.jpeg",
    "audioUrl": "/songs/Bring Me The Horizon - Can You Feel My Heart.mp3",
    "duration": 228
  },
  {
    "title": "Farebi",
    "artist": "Chaar Diwaari",
    "imageUrl": "/extracted-covers/chaar_diwaari__raftaar___farebi_cover.jpeg",
    "audioUrl": "/songs/Chaar Diwaari, Raftaar - Farebi.mp3",
    "duration": 235
  },
  {
    "title": "A Sky Full of Stars",
    "artist": "Coldplay",
    "imageUrl": "/extracted-covers/coldplay___a_sky_full_of_stars_cover.jpeg",
    "audioUrl": "/songs/Coldplay - A Sky Full of Stars.mp3",
    "duration": 268
  },
  {
    "title": "Adventure of a Lifetime",
    "artist": "Coldplay",
    "imageUrl": "/extracted-covers/coldplay___adventure_of_a_lifetime_cover.jpeg",
    "audioUrl": "/songs/Coldplay - Adventure of a Lifetime.mp3",
    "duration": 264
  },
  {
    "title": "Clocks",
    "artist": "Coldplay",
    "imageUrl": "/extracted-covers/coldplay___clocks_cover.jpeg",
    "audioUrl": "/songs/Coldplay - Clocks.mp3",
    "duration": 308
  },
  {
    "title": "Fix You",
    "artist": "Coldplay",
    "imageUrl": "/extracted-covers/coldplay___fix_you_cover.jpeg",
    "audioUrl": "/songs/Coldplay - Fix You.mp3",
    "duration": 296
  },
  {
    "title": "Paradise",
    "artist": "Coldplay",
    "imageUrl": "/extracted-covers/coldplay___paradise_cover.jpeg",
    "audioUrl": "/songs/Coldplay - Paradise.mp3",
    "duration": 279
  },
  {
    "title": "Sparks",
    "artist": "Coldplay",
    "imageUrl": "/extracted-covers/coldplay___sparks_cover.jpeg",
    "audioUrl": "/songs/Coldplay - Sparks.mp3",
    "duration": 227
  },
  {
    "title": "The Scientist",
    "artist": "Coldplay",
    "imageUrl": "/extracted-covers/coldplay___the_scientist_cover.jpeg",
    "audioUrl": "/songs/Coldplay - The Scientist.mp3",
    "duration": 310
  },
  {
    "title": "Viva La Vida",
    "artist": "Coldplay",
    "imageUrl": "/extracted-covers/coldplay___viva_la_vida_cover.jpeg",
    "audioUrl": "/songs/Coldplay - Viva La Vida.mp3",
    "duration": 242
  },
  {
    "title": "Yellow",
    "artist": "Coldplay",
    "imageUrl": "/extracted-covers/coldplay___yellow_cover.jpeg",
    "audioUrl": "/songs/Coldplay - Yellow.mp3",
    "duration": 267
  },
  {
    "title": "Something Just Like This - Tokyo Remix",
    "artist": "Coldplay",
    "imageUrl": "/extracted-covers/coldplay__the_chainsmokers___something_just_like_this___tokyo_remix_cover.jpeg",
    "audioUrl": "/songs/Coldplay, The Chainsmokers - Something Just Like This - Tokyo Remix.mp3",
    "duration": 273
  },
  {
    "title": "Asal Mein",
    "artist": "Darshan Raval",
    "imageUrl": "/extracted-covers/darshan_raval___asal_mein_cover.jpeg",
    "audioUrl": "/songs/Darshan Raval - Asal Mein.mp3",
    "duration": 224
  },
  {
    "title": "Hawa Banke",
    "artist": "Darshan Raval",
    "imageUrl": "/extracted-covers/darshan_raval___hawa_banke_cover.jpeg",
    "audioUrl": "/songs/Darshan Raval - Hawa Banke.mp3",
    "duration": 172
  },
  {
    "title": "Mahiye Jinna Sohna",
    "artist": "Darshan Raval",
    "imageUrl": "/extracted-covers/darshan_raval___mahiye_jinna_sohna_cover.jpeg",
    "audioUrl": "/songs/Darshan Raval - Mahiye Jinna Sohna.mp3",
    "duration": 181
  },
  {
    "title": "Mujhe Peene Do",
    "artist": "Darshan Raval",
    "imageUrl": "/extracted-covers/darshan_raval___mujhe_peene_do_cover.jpeg",
    "audioUrl": "/songs/Darshan Raval - Mujhe Peene Do.mp3",
    "duration": 196
  },
  {
    "title": "Tera Zikr",
    "artist": "Darshan Raval",
    "imageUrl": "/extracted-covers/darshan_raval___tera_zikr_cover.jpeg",
    "audioUrl": "/songs/Darshan Raval - Tera Zikr.mp3",
    "duration": 209
  },
  {
    "title": "Sajna",
    "artist": "Darshan Raval",
    "imageUrl": "/extracted-covers/darshan_raval__aditya_gadhvi__hansika_pareek___sajna_cover.jpeg",
    "audioUrl": "/songs/Darshan Raval, Aditya Gadhvi, Hansika Pareek - Sajna.mp3",
    "duration": 225
  },
  {
    "title": "Chogada",
    "artist": "Darshan Raval",
    "imageUrl": "/extracted-covers/darshan_raval__asees_kaur__lijo_george_dj_chetas__shabbir_ahmed___chogada_cover.jpeg",
    "audioUrl": "/songs/Darshan Raval, Asees Kaur, Lijo George-Dj Chetas, Shabbir Ahmed - Chogada.mp3",
    "duration": 250
  },
  {
    "title": "Soni Soni (Lofi Mix)",
    "artist": "Darshan Raval",
    "imageUrl": "/extracted-covers/darshan_raval__jonita_gandhi__rochak_kohli__gurpreet_saini___soni_soni__lofi_mix__cover.jpeg",
    "audioUrl": "/songs/Darshan Raval, Jonita Gandhi, Rochak Kohli, Gurpreet Saini - Soni Soni (Lofi Mix).mp3",
    "duration": 232
  },
  {
    "title": "Preet Re - From \"Dhadak 2\"",
    "artist": "Darshan Raval",
    "imageUrl": "/extracted-covers/darshan_raval__rochak_kohli__jonita_gandhi__gurpreet_saini___preet_re___from__dhadak_2__cover.jpeg",
    "audioUrl": "/songs/Darshan Raval, Rochak Kohli, Jonita Gandhi, Gurpreet Saini - Preet Re - From 'Dhadak 2'.mp3",
    "duration": 196
  },
  {
    "title": "Ek Ladki Ko Dekha Toh Aisa Laga - Title Track",
    "artist": "Darshan Raval",
    "imageUrl": "/extracted-covers/darshan_raval__rochak_kohli__r__d__burman___ek_ladki_ko_dekha_toh_aisa_laga___title_track_cover.jpeg",
    "audioUrl": "/songs/Darshan Raval, Rochak Kohli, R. D. Burman - Ek Ladki Ko Dekha Toh Aisa Laga - Title Track.mp3",
    "duration": 155
  },
  {
    "title": "Russian Bandana",
    "artist": "Dhanda Nyoliwala",
    "imageUrl": "/extracted-covers/dhanda_nyoliwala___russian_bandana_cover.jpeg",
    "audioUrl": "/songs/Dhanda Nyoliwala - Russian Bandana.mp3",
    "duration": 197
  },
  {
    "title": "Tension",
    "artist": "Dhanda Nyoliwala",
    "imageUrl": "/extracted-covers/dhanda_nyoliwala___tension_cover.jpeg",
    "audioUrl": "/songs/Dhanda Nyoliwala - Tension.mp3",
    "duration": 144
  },
  {
    "title": "Vaaste",
    "artist": "Dhvani Bhanushali",
    "imageUrl": "/extracted-covers/dhvani_bhanushali__nikhil_d_souza__tanishk_bagchi___vaaste_cover.jpeg",
    "audioUrl": "/songs/Dhvani Bhanushali, Nikhil D'Souza, Tanishk Bagchi - Vaaste.mp3",
    "duration": 196
  },
  {
    "title": "Aankhon Se Batana",
    "artist": "Dikshant",
    "imageUrl": "/extracted-covers/dikshant___aankhon_se_batana_cover.jpeg",
    "audioUrl": "/songs/Dikshant - Aankhon Se Batana.mp3",
    "duration": 221
  },
  {
    "title": "Born to Shine",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh___born_to_shine_cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh - Born to Shine.mp3",
    "duration": 213
  },
  {
    "title": "Clash",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh___clash_cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh - Clash.mp3",
    "duration": 176
  },
  {
    "title": "Don",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh___don_cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh - Don.mp3",
    "duration": 203
  },
  {
    "title": "G.O.A.T.",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh___g_o_a_t__cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh - G.O.A.T..mp3",
    "duration": 224
  },
  {
    "title": "Kharku",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh___kharku_cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh - Kharku.mp3",
    "duration": 225
  },
  {
    "title": "Lemonade",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh___lemonade_cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh - Lemonade.mp3",
    "duration": 167
  },
  {
    "title": "Range",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh___range_cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh - Range.mp3",
    "duration": 172
  },
  {
    "title": "Tension",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh___tension_cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh - Tension.mp3",
    "duration": 168
  },
  {
    "title": "Proper Patola (From \"Proper Patola\") (feat. Badshah)",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh__badshah___proper_patola__from__proper_patola____feat__badshah__cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh, Badshah - Proper Patola (From 'Proper Patola') (feat. Badshah).mp3",
    "duration": 151
  },
  {
    "title": "Naina (From \"Crew\")",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh__badshah__raj_ranjodh___naina__from__crew___cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh, Badshah, Raj Ranjodh - Naina (From 'Crew').mp3",
    "duration": 180
  },
  {
    "title": "Naina (Lofi Mix)",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh__badshah__raj_ranjodh___naina__lofi_mix__cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh, Badshah, Raj Ranjodh - Naina (Lofi Mix).mp3",
    "duration": 168
  },
  {
    "title": "Lalkara",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh__intense__sultaan___lalkara_cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh, Intense, Sultaan - Lalkara.mp3",
    "duration": 161
  },
  {
    "title": "5 Taara",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh__jatinder_shah___5_taara_cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh, Jatinder Shah - 5 Taara.mp3",
    "duration": 181
  },
  {
    "title": "Laembadgini",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh__jatinder_shah___laembadgini_cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh, Jatinder Shah - Laembadgini.mp3",
    "duration": 186
  },
  {
    "title": "Happy Birthday",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh__jatinder_shah__balvir_boparai___happy_birthday_cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh, Jatinder Shah, Balvir Boparai - Happy Birthday.mp3",
    "duration": 162
  },
  {
    "title": "Kinni Kinni",
    "artist": "Diljit Dosanjh",
    "imageUrl": "/extracted-covers/diljit_dosanjh__thiarajxtt___kinni_kinni_cover.jpeg",
    "audioUrl": "/songs/Diljit Dosanjh, thiarajxtt - Kinni Kinni.mp3",
    "duration": 213
  },
  {
    "title": "Bol Kaffara Kya Hoga",
    "artist": "Dj Chetas",
    "imageUrl": "/extracted-covers/dj_chetas__neha_kakkar__farhan_sabri___bol_kaffara_kya_hoga_cover.jpeg",
    "audioUrl": "/songs/Dj Chetas, Neha Kakkar, Farhan Sabri - Bol Kaffara Kya Hoga.mp3",
    "duration": 207
  },
  {
    "title": "God's Plan",
    "artist": "Drake",
    "imageUrl": "/extracted-covers/drake___god_s_plan_cover.jpeg",
    "audioUrl": "/songs/Drake - God's Plan.mp3",
    "duration": 199
  },
  {
    "title": "Headlines",
    "artist": "Drake",
    "imageUrl": "/extracted-covers/drake___headlines_cover.jpeg",
    "audioUrl": "/songs/Drake - Headlines.mp3",
    "duration": 237
  },
  {
    "title": "NOKIA",
    "artist": "Drake",
    "imageUrl": "/extracted-covers/drake___nokia_cover.jpeg",
    "audioUrl": "/songs/Drake - NOKIA.mp3",
    "duration": 241
  },
  {
    "title": "Passionfruit",
    "artist": "Drake",
    "imageUrl": "/extracted-covers/drake___passionfruit_cover.jpeg",
    "audioUrl": "/songs/Drake - Passionfruit.mp3",
    "duration": 299
  },
  {
    "title": "What Did I Miss?",
    "artist": "Drake",
    "imageUrl": "/extracted-covers/drake___what_did_i_miss_cover.jpeg",
    "audioUrl": "/songs/Drake - What Did I Miss.mp3",
    "duration": 194
  },
  {
    "title": "Which One (feat. Central Cee)",
    "artist": "Drake",
    "imageUrl": "/extracted-covers/drake__central_cee___which_one__feat__central_cee__cover.jpeg",
    "audioUrl": "/songs/Drake, Central Cee - Which One (feat. Central Cee).mp3",
    "duration": 169
  },
  {
    "title": "Not You Too (feat. Chris Brown)",
    "artist": "Drake",
    "imageUrl": "/extracted-covers/drake__chris_brown___not_you_too__feat__chris_brown__cover.jpeg",
    "audioUrl": "/songs/Drake, Chris Brown - Not You Too (feat. Chris Brown).mp3",
    "duration": 270
  },
  {
    "title": "Azizam",
    "artist": "Ed Sheeran",
    "imageUrl": "/extracted-covers/ed_sheeran___azizam_cover.jpeg",
    "audioUrl": "/songs/Ed Sheeran - Azizam.mp3",
    "duration": 162
  },
  {
    "title": "Perfect",
    "artist": "Ed Sheeran",
    "imageUrl": "/extracted-covers/ed_sheeran___perfect_cover.jpeg",
    "audioUrl": "/songs/Ed Sheeran - Perfect.mp3",
    "duration": 265
  },
  {
    "title": "Sapphire",
    "artist": "Ed Sheeran",
    "imageUrl": "/extracted-covers/ed_sheeran___sapphire_cover.jpeg",
    "audioUrl": "/songs/Ed Sheeran - Sapphire.mp3",
    "duration": 179
  },
  {
    "title": "Shape of You",
    "artist": "Ed Sheeran",
    "imageUrl": "/extracted-covers/ed_sheeran___shape_of_you_cover.jpeg",
    "audioUrl": "/songs/Ed Sheeran - Shape of You.mp3",
    "duration": 234
  },
  {
    "title": "Mockingbird",
    "artist": "Eminem",
    "imageUrl": "/extracted-covers/eminem___mockingbird_cover.jpeg",
    "audioUrl": "/songs/Eminem - Mockingbird.mp3",
    "duration": 251
  },
  {
    "title": "Without Me",
    "artist": "Eminem",
    "imageUrl": "/extracted-covers/eminem___without_me_cover.jpeg",
    "audioUrl": "/songs/Eminem - Without Me.mp3",
    "duration": 290
  },
  {
    "title": "Superman",
    "artist": "Eminem",
    "imageUrl": "/extracted-covers/eminem__dina_rae___superman_cover.jpeg",
    "audioUrl": "/songs/Eminem, Dina Rae - Superman.mp3",
    "duration": 350
  },
  {
    "title": "Love The Way You Lie",
    "artist": "Eminem",
    "imageUrl": "/extracted-covers/eminem__rihanna___love_the_way_you_lie_cover.jpeg",
    "audioUrl": "/songs/Eminem, Rihanna - Love The Way You Lie.mp3",
    "duration": 263
  },
  {
    "title": "Company",
    "artist": "Emiway Bantai",
    "imageUrl": "/extracted-covers/emiway_bantai___company_cover.jpeg",
    "audioUrl": "/songs/Emiway Bantai - Company.mp3",
    "duration": 222
  },
  {
    "title": "Dubai Company",
    "artist": "Emiway Bantai",
    "imageUrl": "/extracted-covers/emiway_bantai___dubai_company_cover.jpeg",
    "audioUrl": "/songs/Emiway Bantai - Dubai Company.mp3",
    "duration": 189
  },
  {
    "title": "GUESS",
    "artist": "Emiway Bantai",
    "imageUrl": "/extracted-covers/emiway_bantai___guess_cover.jpeg",
    "audioUrl": "/songs/Emiway Bantai - GUESS.mp3",
    "duration": 169
  },
  {
    "title": "Machayenge",
    "artist": "Emiway Bantai",
    "imageUrl": "/extracted-covers/emiway_bantai___machayenge_cover.jpeg",
    "audioUrl": "/songs/Emiway Bantai - Machayenge.mp3",
    "duration": 152
  },
  {
    "title": "Paisa Paisa",
    "artist": "Emiway Bantai",
    "imageUrl": "/extracted-covers/emiway_bantai___paisa_paisa_cover.jpeg",
    "audioUrl": "/songs/Emiway Bantai - Paisa Paisa.mp3",
    "duration": 186
  },
  {
    "title": "Ishq",
    "artist": "Faheem Abdullah",
    "imageUrl": "/extracted-covers/faheem_abdullah__rauhan_malik__amir_ameer___ishq_cover.jpeg",
    "audioUrl": "/songs/Faheem Abdullah, Rauhan Malik, Amir Ameer - Ishq.mp3",
    "duration": 229
  },
  {
    "title": "Gata Only (Remix)",
    "artist": "FloyyMenor",
    "imageUrl": "/extracted-covers/floyymenor__ozuna__anitta___gata_only__remix__cover.jpeg",
    "audioUrl": "/songs/FloyyMenor, Ozuna, Anitta - Gata Only (Remix).mp3",
    "duration": 231
  },
  {
    "title": "Est-ce que tu m'aimes ? - Pilule bleue",
    "artist": "GIMS",
    "imageUrl": "/extracted-covers/gims___est_ce_que_tu_m_aimes____pilule_bleue_cover.jpeg",
    "audioUrl": "/songs/GIMS - Est-ce que tu m'aimes  - Pilule bleue.mp3",
    "duration": 237
  },
  {
    "title": "Mann Mera",
    "artist": "Gajendra Verma",
    "imageUrl": "/extracted-covers/gajendra_verma___mann_mera_cover.jpeg",
    "audioUrl": "/songs/Gajendra Verma - Mann Mera.mp3",
    "duration": 200
  },
  {
    "title": "Tera Ghata",
    "artist": "Gajendra Verma",
    "imageUrl": "/extracted-covers/gajendra_verma___tera_ghata_cover.jpeg",
    "audioUrl": "/songs/Gajendra Verma - Tera Ghata.mp3",
    "duration": 254
  },
  {
    "title": "Freed from Desire",
    "artist": "Gala",
    "imageUrl": "/extracted-covers/gala___freed_from_desire_cover.jpeg",
    "audioUrl": "/songs/Gala - Freed from Desire.mp3",
    "duration": 213
  },
  {
    "title": "Bekarar Karke",
    "artist": "Gaurav Dagaonkar",
    "imageUrl": "/extracted-covers/gaurav_dagaonkar__hemant_kumar___bekarar_karke_cover.jpeg",
    "audioUrl": "/songs/Gaurav Dagaonkar, Hemant Kumar - Bekarar Karke.mp3",
    "duration": 191
  },
  {
    "title": "Vibe Undi (From \"Mirai\") [Telugu]",
    "artist": "GowraHari",
    "imageUrl": "/extracted-covers/gowrahari__armaan_malik__krishna_kanth___vibe_undi__from__mirai____telugu__cover.jpeg",
    "audioUrl": "/songs/GowraHari, Armaan Malik, Krishna Kanth - Vibe Undi (From 'Mirai') [Telugu].mp3",
    "duration": 202
  },
  {
    "title": "Risk",
    "artist": "Gracie Abrams",
    "imageUrl": "/extracted-covers/gracie_abrams___risk_cover.jpeg",
    "audioUrl": "/songs/Gracie Abrams - Risk.mp3",
    "duration": 192
  },
  {
    "title": "That’s So True",
    "artist": "Gracie Abrams",
    "imageUrl": "/extracted-covers/gracie_abrams___that_s_so_true_cover.jpeg",
    "audioUrl": "/songs/Gracie Abrams - That’s So True.mp3",
    "duration": 166
  },
  {
    "title": "Suit Suit",
    "artist": "Guru Randhawa",
    "imageUrl": "/extracted-covers/guru_randhawa__arjun__rajat_nagpal__intense___suit_suit_cover.jpeg",
    "audioUrl": "/songs/Guru Randhawa, Arjun, Rajat Nagpal, Intense - Suit Suit.mp3",
    "duration": 190
  },
  {
    "title": "Ishare Tere",
    "artist": "Guru Randhawa",
    "imageUrl": "/extracted-covers/guru_randhawa__dhvani_bhanushali___ishare_tere_cover.jpeg",
    "audioUrl": "/songs/Guru Randhawa, Dhvani Bhanushali - Ishare Tere.mp3",
    "duration": 189
  },
  {
    "title": "AZUL",
    "artist": "Guru Randhawa",
    "imageUrl": "/extracted-covers/guru_randhawa__gurjit_gill__lavish_dhiman___azul_cover.jpeg",
    "audioUrl": "/songs/Guru Randhawa, Gurjit Gill, Lavish Dhiman - AZUL.mp3",
    "duration": 138
  },
  {
    "title": "Sirra",
    "artist": "Guru Randhawa",
    "imageUrl": "/extracted-covers/guru_randhawa__kiran_bajwa__rony_ajnali___sirra_cover.jpeg",
    "audioUrl": "/songs/Guru Randhawa, Kiran Bajwa, Rony Ajnali - Sirra.mp3",
    "duration": 146
  },
  {
    "title": "Qatal",
    "artist": "Guru Randhawa",
    "imageUrl": "/extracted-covers/guru_randhawa__sanjoy__gill_machhrai___qatal_cover.jpeg",
    "audioUrl": "/songs/Guru Randhawa, Sanjoy, Gill Machhrai - Qatal.mp3",
    "duration": 172
  },
  {
    "title": "Lagdi Lahore Di (From \"Street Dancer 3D\")",
    "artist": "Guru Randhawa",
    "imageUrl": "/extracted-covers/guru_randhawa__tulsi_kumar___lagdi_lahore_di__from__street_dancer_3d___cover.jpeg",
    "audioUrl": "/songs/Guru Randhawa, Tulsi Kumar - Lagdi Lahore Di (From 'Street Dancer 3D').mp3",
    "duration": 215
  },
  {
    "title": "Katiya Karun",
    "artist": "Harshdeep Kaur",
    "imageUrl": "/extracted-covers/harshdeep_kaur___katiya_karun_cover.jpeg",
    "audioUrl": "/songs/Harshdeep Kaur - Katiya Karun.mp3",
    "duration": 238
  },
  {
    "title": "Hawa Hawa",
    "artist": "Hassan Jahangir",
    "imageUrl": "/extracted-covers/hassan_jahangir___hawa_hawa_cover.jpeg",
    "audioUrl": "/songs/Hassan Jahangir - Hawa Hawa.mp3",
    "duration": 370
  },
  {
    "title": "Beqarar Karke Hamen Yun Na Jaiye",
    "artist": "Hemant Kumar",
    "imageUrl": "/extracted-covers/hemant_kumar___beqarar_karke_hamen_yun_na_jaiye_cover.jpeg",
    "audioUrl": "/songs/Hemant Kumar - Beqarar Karke Hamen Yun Na Jaiye.mp3",
    "duration": 190
  },
  {
    "title": "Jane Woh Kaise Log The",
    "artist": "Hemant Kumar",
    "imageUrl": "/extracted-covers/hemant_kumar___jane_woh_kaise_log_the_cover.jpeg",
    "audioUrl": "/songs/Hemant Kumar - Jane Woh Kaise Log The.mp3",
    "duration": 259
  },
  {
    "title": "Hookah Bar",
    "artist": "Himesh Reshammiya",
    "imageUrl": "/extracted-covers/himesh_reshammiya__vineet_singh__aaman_trikha___hookah_bar_cover.jpeg",
    "audioUrl": "/songs/Himesh Reshammiya, Vineet Singh, Aaman Trikha - Hookah Bar.mp3",
    "duration": 254
  },
  {
    "title": "Amplifier",
    "artist": "Imran Khan",
    "imageUrl": "/extracted-covers/imran_khan___amplifier_cover.jpeg",
    "audioUrl": "/songs/Imran Khan - Amplifier.mp3",
    "duration": 233
  },
  {
    "title": "like JENNIE",
    "artist": "JENNIE",
    "imageUrl": "/extracted-covers/jennie___like_jennie_cover.jpeg",
    "audioUrl": "/songs/JENNIE - like JENNIE.mp3",
    "duration": 124
  },
  {
    "title": "Heeriye (feat. Arijit Singh)",
    "artist": "Jasleen Royal",
    "imageUrl": "/extracted-covers/jasleen_royal__arijit_singh__dulquer_salmaan___heeriye__feat__arijit_singh__cover.jpeg",
    "audioUrl": "/songs/Jasleen Royal, Arijit Singh, Dulquer Salmaan - Heeriye (feat. Arijit Singh).mp3",
    "duration": 195
  },
  {
    "title": "Ranjha (From \"Shershaah\")",
    "artist": "Jasleen Royal",
    "imageUrl": "/extracted-covers/jasleen_royal__b_praak__romy___ranjha__from__shershaah___cover.jpeg",
    "audioUrl": "/songs/Jasleen Royal, B Praak, Romy - Ranjha (From 'Shershaah').mp3",
    "duration": 229
  },
  {
    "title": "Sang Rahiyo",
    "artist": "Jasleen Royal",
    "imageUrl": "/extracted-covers/jasleen_royal__ranveer_allahbadia__ujjwal_kashyap___sang_rahiyo_cover.jpeg",
    "audioUrl": "/songs/Jasleen Royal, Ranveer Allahbadia, Ujjwal Kashyap - Sang Rahiyo.mp3",
    "duration": 213
  },
  {
    "title": "Sang Rahiyo",
    "artist": "Jasleen Royal",
    "imageUrl": "/extracted-covers/jasleen_royal__ujjwal_kashyap___sang_rahiyo_cover.jpeg",
    "audioUrl": "/songs/Jasleen Royal, Ujjwal Kashyap - Sang Rahiyo.mp3",
    "duration": 213
  },
  {
    "title": "Guitar Sikhda",
    "artist": "Jassie Gill",
    "imageUrl": "/extracted-covers/jassie_gill___guitar_sikhda_cover.jpeg",
    "audioUrl": "/songs/Jassie Gill - Guitar Sikhda.mp3",
    "duration": 189
  },
  {
    "title": "Aankhein Khuli",
    "artist": "Jatin-Lalit",
    "imageUrl": "/extracted-covers/jatin_lalit__lata_mangeshkar__udit_narayan__udbhav__manohar_shetty__ishaan__shweta_pandit__sonali_bhatawdekar__pritha_mazumdar__anand_bakshi___aankhein_khuli_cover.jpeg",
    "audioUrl": "/songs/Jatin-Lalit, Lata Mangeshkar, Udit Narayan, Udbhav, Manohar Shetty, Ishaan, Shweta Pandit, Sonali Bhatawdekar, Pritha Mazumdar, Anand Bakshi - Aankhein Khuli.mp3",
    "duration": 422
  },
  {
    "title": "Chand Sifarish",
    "artist": "Jatin-Lalit",
    "imageUrl": "/extracted-covers/jatin_lalit__shaan__kailash_kher__prasoon_joshi___chand_sifarish_cover.jpeg",
    "audioUrl": "/songs/Jatin-Lalit, Shaan, Kailash Kher, Prasoon Joshi - Chand Sifarish.mp3",
    "duration": 276
  },
  {
    "title": "Guzarish",
    "artist": "Javed Ali",
    "imageUrl": "/extracted-covers/javed_ali___guzarish_cover.jpeg",
    "audioUrl": "/songs/Javed Ali - Guzarish.mp3",
    "duration": 328
  },
  {
    "title": "Pal",
    "artist": "Javed-Mohsin",
    "imageUrl": "/extracted-covers/javed_mohsin__arijit_singh__shreya_ghoshal__kunaal_vermaa__prashant_ingole___pal_cover.jpeg",
    "audioUrl": "/songs/Javed-Mohsin, Arijit Singh, Shreya Ghoshal, Kunaal Vermaa, Prashant Ingole - Pal.mp3",
    "duration": 247
  },
  {
    "title": "High Heels",
    "artist": "Jaz Dhami",
    "imageUrl": "/extracted-covers/jaz_dhami__yo_yo_honey_singh___high_heels_cover.jpeg",
    "audioUrl": "/songs/Jaz Dhami, Yo Yo Honey Singh - High Heels.mp3",
    "duration": 298
  },
  {
    "title": "Mera Pyar Tera Pyar",
    "artist": "Jeet Gannguli",
    "imageUrl": "/extracted-covers/jeet_gannguli__arijit_singh___mera_pyar_tera_pyar_cover.jpeg",
    "audioUrl": "/songs/Jeet Gannguli, Arijit Singh - Mera Pyar Tera Pyar.mp3",
    "duration": 275
  },
  {
    "title": "On The Floor",
    "artist": "Jennifer Lopez",
    "imageUrl": "/extracted-covers/jennifer_lopez__pitbull___on_the_floor_cover.jpeg",
    "audioUrl": "/songs/Jennifer Lopez, Pitbull - On The Floor.mp3",
    "duration": 285
  },
  {
    "title": "Glimpse of Us",
    "artist": "Joji",
    "imageUrl": "/extracted-covers/joji___glimpse_of_us_cover.jpeg",
    "audioUrl": "/songs/Joji - Glimpse of Us.mp3",
    "duration": 234
  },
  {
    "title": "Tere Bina Na Guzara E",
    "artist": "Josh Brar",
    "imageUrl": "/extracted-covers/josh_brar___tere_bina_na_guzara_e_cover.jpeg",
    "audioUrl": "/songs/Josh Brar - Tere Bina Na Guzara E.mp3",
    "duration": 221
  },
  {
    "title": "Tum Hi Aana (Sad Version)",
    "artist": "Jubin Nautiyal",
    "imageUrl": "/extracted-covers/jubin_nautiyal__kunaal_vermaa___tum_hi_aana__sad_version__cover.jpeg",
    "audioUrl": "/songs/Jubin Nautiyal, Kunaal Vermaa - Tum Hi Aana (Sad Version).mp3",
    "duration": 83
  },
  {
    "title": "Humnava Mere",
    "artist": "Jubin Nautiyal",
    "imageUrl": "/extracted-covers/jubin_nautiyal__manoj_muntashir___humnava_mere_cover.jpeg",
    "audioUrl": "/songs/Jubin Nautiyal, Manoj Muntashir - Humnava Mere.mp3",
    "duration": 329
  },
  {
    "title": "Kaabil Hoon (From \"Kaabil\")",
    "artist": "Jubin Nautiyal",
    "imageUrl": "/extracted-covers/jubin_nautiyal__palak_muchhal___kaabil_hoon__from__kaabil___cover.jpeg",
    "audioUrl": "/songs/Jubin Nautiyal, Palak Muchhal - Kaabil Hoon (From 'Kaabil').mp3",
    "duration": 314
  },
  {
    "title": "Kaabil Hoon",
    "artist": "Jubin Nautiyal",
    "imageUrl": "/extracted-covers/jubin_nautiyal__palak_muchhal__rajesh_roshan__nasir_faraaz___kaabil_hoon_cover.jpeg",
    "audioUrl": "/songs/Jubin Nautiyal, Palak Muchhal, Rajesh Roshan, Nasir Faraaz - Kaabil Hoon.mp3",
    "duration": 314
  },
  {
    "title": "Meri Maa Ke Barabar Koi Nahi",
    "artist": "Jubin Nautiyal",
    "imageUrl": "/extracted-covers/jubin_nautiyal__payal_dev__manoj_muntashir___meri_maa_ke_barabar_koi_nahi_cover.jpeg",
    "audioUrl": "/songs/Jubin Nautiyal, Payal Dev, Manoj Muntashir - Meri Maa Ke Barabar Koi Nahi.mp3",
    "duration": 298
  },
  {
    "title": "Agar Tum Saath Ho-Maahi Ve",
    "artist": "Jubin Nautiyal",
    "imageUrl": "/extracted-covers/jubin_nautiyal__prakriti_kakar___agar_tum_saath_ho_maahi_ve_cover.jpeg",
    "audioUrl": "/songs/Jubin Nautiyal, Prakriti Kakar - Agar Tum Saath Ho-Maahi Ve.mp3",
    "duration": 274
  },
  {
    "title": "Lut Gaye",
    "artist": "Jubin Nautiyal",
    "imageUrl": "/extracted-covers/jubin_nautiyal__tanishk_bagchi__manoj_muntashir__nusrat_fateh_ali_khan___lut_gaye_cover.jpeg",
    "audioUrl": "/songs/Jubin Nautiyal, Tanishk Bagchi, Manoj Muntashir, Nusrat Fateh Ali Khan - Lut Gaye.mp3",
    "duration": 228
  },
  {
    "title": "DAISIES",
    "artist": "Justin Bieber",
    "imageUrl": "/extracted-covers/justin_bieber___daisies_cover.jpeg",
    "audioUrl": "/songs/Justin Bieber - DAISIES.mp3",
    "duration": 176
  },
  {
    "title": "Ghost",
    "artist": "Justin Bieber",
    "imageUrl": "/extracted-covers/justin_bieber___ghost_cover.jpeg",
    "audioUrl": "/songs/Justin Bieber - Ghost.mp3",
    "duration": 153
  },
  {
    "title": "Love Yourself",
    "artist": "Justin Bieber",
    "imageUrl": "/extracted-covers/justin_bieber___love_yourself_cover.jpeg",
    "audioUrl": "/songs/Justin Bieber - Love Yourself.mp3",
    "duration": 224
  },
  {
    "title": "SPEED DEMON",
    "artist": "Justin Bieber",
    "imageUrl": "/extracted-covers/justin_bieber___speed_demon_cover.jpeg",
    "audioUrl": "/songs/Justin Bieber - SPEED DEMON.mp3",
    "duration": 212
  },
  {
    "title": "Sorry",
    "artist": "Justin Bieber",
    "imageUrl": "/extracted-covers/justin_bieber___sorry_cover.jpeg",
    "audioUrl": "/songs/Justin Bieber - Sorry.mp3",
    "duration": 201
  },
  {
    "title": "YUKON",
    "artist": "Justin Bieber",
    "imageUrl": "/extracted-covers/justin_bieber___yukon_cover.jpeg",
    "audioUrl": "/songs/Justin Bieber - YUKON.mp3",
    "duration": 164
  },
  {
    "title": "Confident",
    "artist": "Justin Bieber",
    "imageUrl": "/extracted-covers/justin_bieber__chance_the_rapper___confident_cover.jpeg",
    "audioUrl": "/songs/Justin Bieber, Chance the Rapper - Confident.mp3",
    "duration": 248
  },
  {
    "title": "Mia & Sebastian’s Theme",
    "artist": "Justin Hurwitz",
    "imageUrl": "/extracted-covers/justin_hurwitz___mia___sebastian_s_theme_cover.jpeg",
    "audioUrl": "/songs/Justin Hurwitz - Mia & Sebastian’s Theme.mp3",
    "duration": 97
  },
  {
    "title": "Beete Lamhein Lofi Mix",
    "artist": "KK",
    "imageUrl": "/extracted-covers/kk__mithoon__rimz_music__sayeed_quadri___beete_lamhein_lofi_mix_cover.jpeg",
    "audioUrl": "/songs/KK, Mithoon, Rimz Music, Sayeed Quadri - Beete Lamhein Lofi Mix.mp3",
    "duration": 212
  },
  {
    "title": "Khuda Jaane",
    "artist": "KK",
    "imageUrl": "/extracted-covers/kk__shilpa_rao___khuda_jaane_cover.jpeg",
    "audioUrl": "/songs/KK, Shilpa Rao - Khuda Jaane.mp3",
    "duration": 333
  },
  {
    "title": "I Guess",
    "artist": "KR$NA",
    "imageUrl": "/extracted-covers/kr_na___i_guess_cover.jpeg",
    "audioUrl": "/songs/KR$NA - I Guess.mp3",
    "duration": 186
  },
  {
    "title": "No Cap",
    "artist": "KR$NA",
    "imageUrl": "/extracted-covers/kr_na___no_cap_cover.jpeg",
    "audioUrl": "/songs/KR$NA - No Cap.mp3",
    "duration": 205
  },
  {
    "title": "Prarthana",
    "artist": "KR$NA",
    "imageUrl": "/extracted-covers/kr_na___prarthana_cover.jpeg",
    "audioUrl": "/songs/KR$NA - Prarthana.mp3",
    "duration": 200
  },
  {
    "title": "Knock Knock",
    "artist": "KR$NA",
    "imageUrl": "/extracted-covers/kr_na__phenom___knock_knock_cover.jpeg",
    "audioUrl": "/songs/KR$NA, Phenom - Knock Knock.mp3",
    "duration": 207
  },
  {
    "title": "Hola Amigo",
    "artist": "KR$NA",
    "imageUrl": "/extracted-covers/kr_na__seedhe_maut__umair___hola_amigo_cover.jpeg",
    "audioUrl": "/songs/KR$NA, Seedhe Maut, Umair - Hola Amigo.mp3",
    "duration": 226
  },
  {
    "title": "Joota Japani",
    "artist": "KR$NA",
    "imageUrl": "/extracted-covers/kr_na__umair__mukesh___joota_japani_cover.jpeg",
    "audioUrl": "/songs/KR$NA, Umair, Mukesh - Joota Japani.mp3",
    "duration": 155
  },
  {
    "title": "Allah Ke Bande",
    "artist": "Kailash Kher",
    "imageUrl": "/extracted-covers/kailash_kher___allah_ke_bande_cover.jpeg",
    "audioUrl": "/songs/Kailash Kher - Allah Ke Bande.mp3",
    "duration": 247
  },
  {
    "title": "Ya Rabba",
    "artist": "Kailash Kher",
    "imageUrl": "/extracted-covers/kailash_kher___ya_rabba_cover.jpeg",
    "audioUrl": "/songs/Kailash Kher - Ya Rabba.mp3",
    "duration": 419
  },
  {
    "title": "Mere Nishaan",
    "artist": "Kailash Kher",
    "imageUrl": "/extracted-covers/kailash_kher__meet_bros_anjjan___mere_nishaan_cover.jpeg",
    "audioUrl": "/songs/Kailash Kher, Meet Bros Anjjan - Mere Nishaan.mp3",
    "duration": 301
  },
  {
    "title": "Bam Lahiri",
    "artist": "Kailash Kher",
    "imageUrl": "/extracted-covers/kailash_kher__paresh_kamath__naresh_kamath___bam_lahiri_cover.jpeg",
    "audioUrl": "/songs/Kailash Kher, Paresh Kamath, Naresh Kamath - Bam Lahiri.mp3",
    "duration": 317
  },
  {
    "title": "Saiyyan",
    "artist": "Kailash Kher",
    "imageUrl": "/extracted-covers/kailash_kher__paresh_kamath__naresh_kamath___saiyyan_cover.jpeg",
    "audioUrl": "/songs/Kailash Kher, Paresh Kamath, Naresh Kamath - Saiyyan.mp3",
    "duration": 344
  },
  {
    "title": "Teri Deewani",
    "artist": "Kailash Kher",
    "imageUrl": "/extracted-covers/kailash_kher__paresh_kamath__naresh_kamath___teri_deewani_cover.jpeg",
    "audioUrl": "/songs/Kailash Kher, Paresh Kamath, Naresh Kamath - Teri Deewani.mp3",
    "duration": 324
  },
  {
    "title": "Neele Neele Ambar Par - Male Version",
    "artist": "Kalyanji-Anandji",
    "imageUrl": "/extracted-covers/kalyanji_anandji__kishore_kumar___neele_neele_ambar_par___male_version_cover.jpeg",
    "audioUrl": "/songs/Kalyanji-Anandji, Kishore Kumar - Neele Neele Ambar Par - Male Version.mp3",
    "duration": 320
  },
  {
    "title": "2am",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla___2am_cover.jpeg",
    "audioUrl": "/songs/Karan Aujla - 2am.mp3",
    "duration": 257
  },
  {
    "title": "ANTIDOTE",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla___antidote_cover.jpeg",
    "audioUrl": "/songs/Karan Aujla - ANTIDOTE.mp3",
    "duration": 187
  },
  {
    "title": "Admirin' You - Unplugged",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla___admirin__you___unplugged_cover.jpeg",
    "audioUrl": "/songs/Karan Aujla - Admirin' You - Unplugged.mp3",
    "duration": 196
  },
  {
    "title": "Mexico",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla___mexico_cover.jpeg",
    "audioUrl": "/songs/Karan Aujla - Mexico.mp3",
    "duration": 206
  },
  {
    "title": "Tauba Tauba (From \"Bad Newz\")",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla___tauba_tauba__from__bad_newz___cover.jpeg",
    "audioUrl": "/songs/Karan Aujla - Tauba Tauba (From 'Bad Newz').mp3",
    "duration": 207
  },
  {
    "title": "52 Bars",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla__ikky___52_bars_cover.jpeg",
    "audioUrl": "/songs/Karan Aujla, Ikky - 52 Bars.mp3",
    "duration": 214
  },
  {
    "title": "At Peace",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla__ikky___at_peace_cover.jpeg",
    "audioUrl": "/songs/Karan Aujla, Ikky - At Peace.mp3",
    "duration": 164
  },
  {
    "title": "Boyfriend",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla__ikky___boyfriend_cover.jpeg",
    "audioUrl": "/songs/Karan Aujla, Ikky - Boyfriend.mp3",
    "duration": 161
  },
  {
    "title": "For A Reason",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla__ikky___for_a_reason_cover.jpeg",
    "audioUrl": "/songs/Karan Aujla, Ikky - For A Reason.mp3",
    "duration": 180
  },
  {
    "title": "Gabhru!",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla__ikky___gabhru__cover.jpeg",
    "audioUrl": "/songs/Karan Aujla, Ikky - Gabhru!.mp3",
    "duration": 200
  },
  {
    "title": "Softly",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla__ikky___softly_cover.jpeg",
    "audioUrl": "/songs/Karan Aujla, Ikky - Softly.mp3",
    "duration": 155
  },
  {
    "title": "Wavy",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla__jay_trak___wavy_cover.jpeg",
    "audioUrl": "/songs/Karan Aujla, Jay Trak - Wavy.mp3",
    "duration": 161
  },
  {
    "title": "Aaye Haaye (From \"Aaye Haaye\")",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla__neha_kakkar___aaye_haaye__from__aaye_haaye___cover.jpeg",
    "audioUrl": "/songs/Karan Aujla, Neha Kakkar - Aaye Haaye (From 'Aaye Haaye').mp3",
    "duration": 195
  },
  {
    "title": "Winning Speech",
    "artist": "Karan Aujla",
    "imageUrl": "/extracted-covers/karan_aujla__seshnolan___winning_speech_cover.jpeg",
    "audioUrl": "/songs/Karan Aujla, Seshnolan - Winning Speech.mp3",
    "duration": 227
  },
  {
    "title": "Karta Kya Hai",
    "artist": "Karma",
    "imageUrl": "/extracted-covers/karma__raftaar___karta_kya_hai_cover.jpeg",
    "audioUrl": "/songs/Karma, Raftaar - Karta Kya Hai.mp3",
    "duration": 204
  },
  {
    "title": "Tum Ko",
    "artist": "Kavita Krishnamurthy",
    "imageUrl": "/extracted-covers/kavita_krishnamurthy___tum_ko_cover.jpeg",
    "audioUrl": "/songs/Kavita Krishnamurthy - Tum Ko.mp3",
    "duration": 345
  },
  {
    "title": "GOAT SHIT",
    "artist": "King",
    "imageUrl": "/extracted-covers/king__karma___goat_shit_cover.jpeg",
    "audioUrl": "/songs/King, Karma - GOAT SHIT.mp3",
    "duration": 231
  },
  {
    "title": "Pal Pal Dil Ke Paas - From \"Blackmail\"",
    "artist": "Kishore Kumar",
    "imageUrl": "/extracted-covers/kishore_kumar___pal_pal_dil_ke_paas___from__blackmail__cover.jpeg",
    "audioUrl": "/songs/Kishore Kumar - Pal Pal Dil Ke Paas - From 'Blackmail'.mp3",
    "duration": 329
  },
  {
    "title": "Dilbar Mere - From \"Satte Pe Satta\"",
    "artist": "Kishore Kumar",
    "imageUrl": "/extracted-covers/kishore_kumar__anette__r__d__burman___dilbar_mere___from__satte_pe_satta__cover.jpeg",
    "audioUrl": "/songs/Kishore Kumar, Anette, R. D. Burman - Dilbar Mere - From 'Satte Pe Satta'.mp3",
    "duration": 289
  },
  {
    "title": "Yeh Raaten Yeh Mausam",
    "artist": "Kishore Kumar",
    "imageUrl": "/extracted-covers/kishore_kumar__asha_bhosle___yeh_raaten_yeh_mausam_cover.jpeg",
    "audioUrl": "/songs/Kishore Kumar, Asha Bhosle - Yeh Raaten Yeh Mausam.mp3",
    "duration": 201
  },
  {
    "title": "Yeh Vaada Raha - Tu Tu Hai Wahi / From “Yeh Vaada Raha”",
    "artist": "Kishore Kumar",
    "imageUrl": "/extracted-covers/kishore_kumar__asha_bhosle__r__d__burman___yeh_vaada_raha___tu_tu_hai_wahi__from__yeh_vaada_raha__cover.jpeg",
    "audioUrl": "/songs/Kishore Kumar, Asha Bhosle, R. D. Burman - Yeh Vaada Raha - Tu Tu Hai Wahi  From “Yeh Vaada Raha”.mp3",
    "duration": 409
  },
  {
    "title": "Aap Ki Ankhon Mein Kuch",
    "artist": "Kishore Kumar",
    "imageUrl": "/extracted-covers/kishore_kumar__lata_mangeshkar___aap_ki_ankhon_mein_kuch_cover.jpeg",
    "audioUrl": "/songs/Kishore Kumar, Lata Mangeshkar - Aap Ki Ankhon Mein Kuch.mp3",
    "duration": 249
  },
  {
    "title": "Mere Mehboob Qayamat Hogi",
    "artist": "Kishore Kumar",
    "imageUrl": "/extracted-covers/kishore_kumar__laxmikant_pyarelal___mere_mehboob_qayamat_hogi_cover.jpeg",
    "audioUrl": "/songs/Kishore Kumar, Laxmikant–Pyarelal - Mere Mehboob Qayamat Hogi.mp3",
    "duration": 229
  },
  {
    "title": "Ek Ajnabee Haseena Se",
    "artist": "Kishore Kumar",
    "imageUrl": "/extracted-covers/kishore_kumar__r__d__burman___ek_ajnabee_haseena_se_cover.jpeg",
    "audioUrl": "/songs/Kishore Kumar, R. D. Burman - Ek Ajnabee Haseena Se.mp3",
    "duration": 267
  },
  {
    "title": "Meri Bheegi Bheegi Si",
    "artist": "Kishore Kumar",
    "imageUrl": "/extracted-covers/kishore_kumar__r__d__burman___meri_bheegi_bheegi_si_cover.jpeg",
    "audioUrl": "/songs/Kishore Kumar, R. D. Burman - Meri Bheegi Bheegi Si.mp3",
    "duration": 247
  },
  {
    "title": "O Mere Dil Ke Chain",
    "artist": "Kishore Kumar",
    "imageUrl": "/extracted-covers/kishore_kumar__r__d__burman___o_mere_dil_ke_chain_cover.jpeg",
    "audioUrl": "/songs/Kishore Kumar, R. D. Burman - O Mere Dil Ke Chain.mp3",
    "duration": 273
  },
  {
    "title": "Yeh Sham Mastani",
    "artist": "Kishore Kumar",
    "imageUrl": "/extracted-covers/kishore_kumar__r__d__burman___yeh_sham_mastani_cover.jpeg",
    "audioUrl": "/songs/Kishore Kumar, R. D. Burman - Yeh Sham Mastani.mp3",
    "duration": 270
  },
  {
    "title": "Chura Liya Hai Tumne Jo Dil Ko",
    "artist": "Kunal Bojewar",
    "imageUrl": "/extracted-covers/kunal_bojewar___chura_liya_hai_tumne_jo_dil_ko_cover.jpeg",
    "audioUrl": "/songs/Kunal Bojewar - Chura Liya Hai Tumne Jo Dil Ko.mp3",
    "duration": 196
  },
  {
    "title": "Chiggy Wiggy",
    "artist": "Kylie Minogue",
    "imageUrl": "/extracted-covers/kylie_minogue__sonu_nigam__suzanne__a_r__rahman__abbas_tyrewala___chiggy_wiggy_cover.jpeg",
    "audioUrl": "/songs/Kylie Minogue, Sonu Nigam, Suzanne, A.R. Rahman, Abbas Tyrewala - Chiggy Wiggy.mp3",
    "duration": 310
  },
  {
    "title": "London Thumakda",
    "artist": "Labh Janjua",
    "imageUrl": "/extracted-covers/labh_janjua__sonu_kakkar__neha_kakkar___london_thumakda_cover.jpeg",
    "audioUrl": "/songs/Labh Janjua, Sonu Kakkar, Neha Kakkar - London Thumakda.mp3",
    "duration": 230
  },
  {
    "title": "Mount Everest",
    "artist": "Labrinth",
    "imageUrl": "/extracted-covers/labrinth___mount_everest_cover.jpeg",
    "audioUrl": "/songs/Labrinth - Mount Everest.mp3",
    "duration": 158
  },
  {
    "title": "Die With A Smile",
    "artist": "Lady Gaga",
    "imageUrl": "/extracted-covers/lady_gaga__bruno_mars___die_with_a_smile_cover.jpeg",
    "audioUrl": "/songs/Lady Gaga, Bruno Mars - Die With A Smile.mp3",
    "duration": 252
  },
  {
    "title": "Laid to Rest",
    "artist": "Lamb of God",
    "imageUrl": "/extracted-covers/lamb_of_god___laid_to_rest_cover.jpeg",
    "audioUrl": "/songs/Lamb of God - Laid to Rest.mp3",
    "duration": 230
  },
  {
    "title": "Diet Mountain Dew",
    "artist": "Lana Del Rey",
    "imageUrl": "/extracted-covers/lana_del_rey___diet_mountain_dew_cover.jpeg",
    "audioUrl": "/songs/Lana Del Rey - Diet Mountain Dew.mp3",
    "duration": 223
  },
  {
    "title": "Mere Khwabon Mein",
    "artist": "Lata Mangeshkar",
    "imageUrl": "/extracted-covers/lata_mangeshkar___mere_khwabon_mein_cover.jpeg",
    "audioUrl": "/songs/Lata Mangeshkar - Mere Khwabon Mein.mp3",
    "duration": 256
  },
  {
    "title": "Aaja Piya Tohe Pyar Doon",
    "artist": "Lata Mangeshkar",
    "imageUrl": "/extracted-covers/lata_mangeshkar__r__d__burman___aaja_piya_tohe_pyar_doon_cover.jpeg",
    "audioUrl": "/songs/Lata Mangeshkar, R. D. Burman - Aaja Piya Tohe Pyar Doon.mp3",
    "duration": 251
  },
  {
    "title": "Dil To Pagal Hai - LoFi Mix",
    "artist": "Lata Mangeshkar",
    "imageUrl": "/extracted-covers/lata_mangeshkar__udit_narayan___dil_to_pagal_hai___lofi_mix_cover.jpeg",
    "audioUrl": "/songs/Lata Mangeshkar, Udit Narayan - Dil To Pagal Hai - LoFi Mix.mp3",
    "duration": 222
  },
  {
    "title": "She Will",
    "artist": "Lil Wayne",
    "imageUrl": "/extracted-covers/lil_wayne__drake___she_will_cover.jpeg",
    "audioUrl": "/songs/Lil Wayne, Drake - She Will.mp3",
    "duration": 307
  },
  {
    "title": "Tinku Jiya",
    "artist": "Mamta Sharma",
    "imageUrl": "/extracted-covers/mamta_sharma__javed_ali___tinku_jiya_cover.jpeg",
    "audioUrl": "/songs/Mamta Sharma, Javed Ali - Tinku Jiya.mp3",
    "duration": 298
  },
  {
    "title": "Fevicol Se",
    "artist": "Mamta Sharma",
    "imageUrl": "/extracted-covers/mamta_sharma__wajid___fevicol_se_cover.jpeg",
    "audioUrl": "/songs/Mamta Sharma, Wajid - Fevicol Se.mp3",
    "duration": 290
  },
  {
    "title": "Ada All Thotta Boopathi (From \"Youth\")",
    "artist": "Mani Sharma",
    "imageUrl": "/extracted-covers/mani_sharma__kabilan__shankar_mahadevan___ada_all_thotta_boopathi__from__youth___cover.jpeg",
    "audioUrl": "/songs/Mani Sharma, Kabilan, Shankar Mahadevan - Ada All Thotta Boopathi (From 'Youth').mp3",
    "duration": 295
  },
  {
    "title": "Ek Khtola Jail Ke Bhitar",
    "artist": "Masoom Sharma",
    "imageUrl": "/extracted-covers/masoom_sharma___ek_khtola_jail_ke_bhitar_cover.jpeg",
    "audioUrl": "/songs/Masoom Sharma - Ek Khtola Jail Ke Bhitar.mp3",
    "duration": 166
  },
  {
    "title": "Chambal K Dakku",
    "artist": "Masoom Sharma",
    "imageUrl": "/extracted-covers/masoom_sharma__rahul_muana__swara_verma__ruba_khan___chambal_k_dakku_cover.jpeg",
    "audioUrl": "/songs/Masoom Sharma, Rahul Muana, Swara Verma, Ruba Khan - Chambal K Dakku.mp3",
    "duration": 228
  },
  {
    "title": "Lofar",
    "artist": "Masoom Sharma",
    "imageUrl": "/extracted-covers/masoom_sharma__swara_verma___lofar_cover.jpeg",
    "audioUrl": "/songs/Masoom Sharma, Swara Verma - Lofar.mp3",
    "duration": 130
  },
  {
    "title": "Raat Ke Shikari",
    "artist": "Masoom Sharma",
    "imageUrl": "/extracted-covers/masoom_sharma__sweta_chauhan__yash_thukral___raat_ke_shikari_cover.jpeg",
    "audioUrl": "/songs/Masoom Sharma, Sweta Chauhan, Yash Thukral - Raat Ke Shikari.mp3",
    "duration": 149
  },
  {
    "title": "Pink Lips",
    "artist": "Meet Bros Anjjan",
    "imageUrl": "/extracted-covers/meet_bros_anjjan__khushboo_grewal___pink_lips_cover.jpeg",
    "audioUrl": "/songs/Meet Bros Anjjan, Khushboo Grewal - Pink Lips.mp3",
    "duration": 255
  },
  {
    "title": "Kinna Sona (From \"Marjaavaan\")",
    "artist": "Meet Bros.",
    "imageUrl": "/extracted-covers/meet_bros___jubin_nautiyal__dhvani_bhanushali___kinna_sona__from__marjaavaan___cover.jpeg",
    "audioUrl": "/songs/Meet Bros., Jubin Nautiyal, Dhvani Bhanushali - Kinna Sona (From 'Marjaavaan').mp3",
    "duration": 274
  },
  {
    "title": "Dhun",
    "artist": "Mithoon",
    "imageUrl": "/extracted-covers/mithoon__arijit_singh___dhun_cover.jpeg",
    "audioUrl": "/songs/Mithoon, Arijit Singh - Dhun.mp3",
    "duration": 277
  },
  {
    "title": "Tum Hi Ho",
    "artist": "Mithoon",
    "imageUrl": "/extracted-covers/mithoon__arijit_singh___tum_hi_ho_cover.jpeg",
    "audioUrl": "/songs/Mithoon, Arijit Singh - Tum Hi Ho.mp3",
    "duration": 262
  },
  {
    "title": "Phir Bhi Tumko Chaahunga",
    "artist": "Mithoon",
    "imageUrl": "/extracted-covers/mithoon__manoj_muntashir__arijit_singh__shashaa_tirupati___phir_bhi_tumko_chaahunga_cover.jpeg",
    "audioUrl": "/songs/Mithoon, Manoj Muntashir, Arijit Singh, Shashaa Tirupati - Phir Bhi Tumko Chaahunga.mp3",
    "duration": 352
  },
  {
    "title": "Akhiyaan Gulaab (From \"Teri Baaton Mein Aisa Uljha Jiya\")",
    "artist": "Mitraz",
    "imageUrl": "/extracted-covers/mitraz___akhiyaan_gulaab__from__teri_baaton_mein_aisa_uljha_jiya___cover.jpeg",
    "audioUrl": "/songs/Mitraz - Akhiyaan Gulaab (From 'Teri Baaton Mein Aisa Uljha Jiya').mp3",
    "duration": 171
  },
  {
    "title": "Gulaab",
    "artist": "Mitraz",
    "imageUrl": "/extracted-covers/mitraz___gulaab_cover.jpeg",
    "audioUrl": "/songs/Mitraz - Gulaab.mp3",
    "duration": 170
  },
  {
    "title": "Chukar Mere Man Ko - The Unwind Mix",
    "artist": "Mohammed Irfan",
    "imageUrl": "/extracted-covers/mohammed_irfan___chukar_mere_man_ko___the_unwind_mix_cover.jpeg",
    "audioUrl": "/songs/Mohammed Irfan - Chukar Mere Man Ko - The Unwind Mix.mp3",
    "duration": 222
  },
  {
    "title": "Badan Pe Sitare Lapete Huye",
    "artist": "Mohammed Rafi",
    "imageUrl": "/extracted-covers/mohammed_rafi___badan_pe_sitare_lapete_huye_cover.jpeg",
    "audioUrl": "/songs/Mohammed Rafi - Badan Pe Sitare Lapete Huye.mp3",
    "duration": 288
  },
  {
    "title": "Chaudhvin Ka Chand Ho",
    "artist": "Mohammed Rafi",
    "imageUrl": "/extracted-covers/mohammed_rafi___chaudhvin_ka_chand_ho_cover.jpeg",
    "audioUrl": "/songs/Mohammed Rafi - Chaudhvin Ka Chand Ho.mp3",
    "duration": 224
  },
  {
    "title": "Dil Ka Bhanwar Kare Pukar",
    "artist": "Mohammed Rafi",
    "imageUrl": "/extracted-covers/mohammed_rafi___dil_ka_bhanwar_kare_pukar_cover.jpeg",
    "audioUrl": "/songs/Mohammed Rafi - Dil Ka Bhanwar Kare Pukar.mp3",
    "duration": 199
  },
  {
    "title": "Ehsan Tera Hoga Mujh Par",
    "artist": "Mohammed Rafi",
    "imageUrl": "/extracted-covers/mohammed_rafi___ehsan_tera_hoga_mujh_par_cover.jpeg",
    "audioUrl": "/songs/Mohammed Rafi - Ehsan Tera Hoga Mujh Par.mp3",
    "duration": 207
  },
  {
    "title": "Likhe Jo Khat Tujhe",
    "artist": "Mohammed Rafi",
    "imageUrl": "/extracted-covers/mohammed_rafi___likhe_jo_khat_tujhe_cover.jpeg",
    "audioUrl": "/songs/Mohammed Rafi - Likhe Jo Khat Tujhe.mp3",
    "duration": 274
  },
  {
    "title": "Main Zindagi Ka Saath Nibhata Chala Gaya",
    "artist": "Mohammed Rafi",
    "imageUrl": "/extracted-covers/mohammed_rafi___main_zindagi_ka_saath_nibhata_chala_gaya_cover.jpeg",
    "audioUrl": "/songs/Mohammed Rafi - Main Zindagi Ka Saath Nibhata Chala Gaya.mp3",
    "duration": 231
  },
  {
    "title": "Taarif Karoon Kya Uski",
    "artist": "Mohammed Rafi",
    "imageUrl": "/extracted-covers/mohammed_rafi___taarif_karoon_kya_uski_cover.jpeg",
    "audioUrl": "/songs/Mohammed Rafi - Taarif Karoon Kya Uski.mp3",
    "duration": 327
  },
  {
    "title": "Gulabi Ankhen - Remix",
    "artist": "Mohammed Rafi",
    "imageUrl": "/extracted-covers/mohammed_rafi__dj_percy___gulabi_ankhen___remix_cover.jpeg",
    "audioUrl": "/songs/Mohammed Rafi, DJ Percy - Gulabi Ankhen - Remix.mp3",
    "duration": 161
  },
  {
    "title": "Taarif Karoon",
    "artist": "Mohammed Rafi",
    "imageUrl": "/extracted-covers/mohammed_rafi__sanam___taarif_karoon_cover.jpeg",
    "audioUrl": "/songs/Mohammed Rafi, Sanam - Taarif Karoon.mp3",
    "duration": 158
  },
  {
    "title": "Kya Hua Tera Wada",
    "artist": "Mohammed Rafi",
    "imageUrl": "/extracted-covers/mohammed_rafi__sushma_shrestha___kya_hua_tera_wada_cover.jpeg",
    "audioUrl": "/songs/Mohammed Rafi, Sushma Shrestha - Kya Hua Tera Wada.mp3",
    "duration": 240
  },
  {
    "title": "Haawa Haawa",
    "artist": "Mohit Chauhan",
    "imageUrl": "/extracted-covers/mohit_chauhan___haawa_haawa_cover.jpeg",
    "audioUrl": "/songs/Mohit Chauhan - Haawa Haawa.mp3",
    "duration": 340
  },
  {
    "title": "Jaagran (Rockstar)",
    "artist": "Mohit Chauhan",
    "imageUrl": "/extracted-covers/mohit_chauhan___jaagran__rockstar__cover.jpeg",
    "audioUrl": "/songs/Mohit Chauhan - Jaagran (Rockstar).mp3",
    "duration": 63
  },
  {
    "title": "Jo Bhi Main",
    "artist": "Mohit Chauhan",
    "imageUrl": "/extracted-covers/mohit_chauhan___jo_bhi_main_cover.jpeg",
    "audioUrl": "/songs/Mohit Chauhan - Jo Bhi Main.mp3",
    "duration": 274
  },
  {
    "title": "Saadda Haq",
    "artist": "Mohit Chauhan",
    "imageUrl": "/extracted-covers/mohit_chauhan___saadda_haq_cover.jpeg",
    "audioUrl": "/songs/Mohit Chauhan - Saadda Haq.mp3",
    "duration": 363
  },
  {
    "title": "Aur Ho",
    "artist": "Mohit Chauhan",
    "imageUrl": "/extracted-covers/mohit_chauhan__alma_ferovic___aur_ho_cover.jpeg",
    "audioUrl": "/songs/Mohit Chauhan, Alma Ferovic - Aur Ho.mp3",
    "duration": 332
  },
  {
    "title": "Sheher Mein",
    "artist": "Mohit Chauhan",
    "imageUrl": "/extracted-covers/mohit_chauhan__karthik___sheher_mein_cover.jpeg",
    "audioUrl": "/songs/Mohit Chauhan, Karthik - Sheher Mein.mp3",
    "duration": 242
  },
  {
    "title": "Tum Ho",
    "artist": "Mohit Chauhan",
    "imageUrl": "/extracted-covers/mohit_chauhan__suzanne_d_mello___tum_ho_cover.jpeg",
    "audioUrl": "/songs/Mohit Chauhan, Suzanne D'Mello - Tum Ho.mp3",
    "duration": 317
  },
  {
    "title": "Kisi Ki Muskurahaton Pe",
    "artist": "Mukesh",
    "imageUrl": "/extracted-covers/mukesh___kisi_ki_muskurahaton_pe_cover.jpeg",
    "audioUrl": "/songs/Mukesh - Kisi Ki Muskurahaton Pe.mp3",
    "duration": 267
  },
  {
    "title": "Charka",
    "artist": "Mukhtar Sahota",
    "imageUrl": "/extracted-covers/mukhtar_sahota___charka_cover.jpeg",
    "audioUrl": "/songs/Mukhtar Sahota - Charka.mp3",
    "duration": 341
  },
  {
    "title": "Ra Ra Rakkamma",
    "artist": "Nakash Aziz",
    "imageUrl": "/extracted-covers/nakash_aziz__sunidhi_chauhan__b__ajaneesh_loknath__anup_bhandari___ra_ra_rakkamma_cover.jpeg",
    "audioUrl": "/songs/Nakash Aziz, Sunidhi Chauhan, B. Ajaneesh Loknath, Anup Bhandari - Ra Ra Rakkamma.mp3",
    "duration": 218
  },
  {
    "title": "La La La",
    "artist": "Naughty Boy",
    "imageUrl": "/extracted-covers/naughty_boy__sam_smith___la_la_la_cover.jpeg",
    "audioUrl": "/songs/Naughty Boy, Sam Smith - La La La.mp3",
    "duration": 223
  },
  {
    "title": "Kar Gayi Chull",
    "artist": "Neha Kakkar",
    "imageUrl": "/extracted-covers/neha_kakkar___kar_gayi_chull_cover.jpeg",
    "audioUrl": "/songs/Neha Kakkar - Kar Gayi Chull.mp3",
    "duration": 175
  },
  {
    "title": "Dilbar",
    "artist": "Neha Kakkar",
    "imageUrl": "/extracted-covers/neha_kakkar__dhvani_bhanushali__ikka___dilbar_cover.jpeg",
    "audioUrl": "/songs/Neha Kakkar, Dhvani Bhanushali, Ikka - Dilbar.mp3",
    "duration": 184
  },
  {
    "title": "Dilbar (From \"Satyameva Jayate\")",
    "artist": "Neha Kakkar",
    "imageUrl": "/extracted-covers/neha_kakkar__dhvani_bhanushali__ikka__tanishk_bagchi___dilbar__from__satyameva_jayate___cover.jpeg",
    "audioUrl": "/songs/Neha Kakkar, Dhvani Bhanushali, Ikka, Tanishk Bagchi - Dilbar (From 'Satyameva Jayate').mp3",
    "duration": 184
  },
  {
    "title": "Aankh Marey (From \"Simmba\")",
    "artist": "Neha Kakkar",
    "imageUrl": "/extracted-covers/neha_kakkar__mika_singh__kumar_sanu__tanishk_bagchi___aankh_marey__from__simmba___cover.jpeg",
    "audioUrl": "/songs/Neha Kakkar, Mika Singh, Kumar Sanu, Tanishk Bagchi - Aankh Marey (From 'Simmba').mp3",
    "duration": 213
  },
  {
    "title": "Gali Gali",
    "artist": "Neha Kakkar",
    "imageUrl": "/extracted-covers/neha_kakkar__rashmi_virag___gali_gali_cover.jpeg",
    "audioUrl": "/songs/Neha Kakkar, Rashmi Virag - Gali Gali.mp3",
    "duration": 195
  },
  {
    "title": "Baarish Mein Tum",
    "artist": "Neha Kakkar",
    "imageUrl": "/extracted-covers/neha_kakkar__rohanpreet_singh__showkidd__samay___baarish_mein_tum_cover.jpeg",
    "audioUrl": "/songs/Neha Kakkar, Rohanpreet Singh, Showkidd, Samay - Baarish Mein Tum.mp3",
    "duration": 227
  },
  {
    "title": "O Saki Saki (From \"Batla House\")",
    "artist": "Neha Kakkar",
    "imageUrl": "/extracted-covers/neha_kakkar__tulsi_kumar__b_praak___o_saki_saki__from__batla_house___cover.jpeg",
    "audioUrl": "/songs/Neha Kakkar, Tulsi Kumar, B Praak - O Saki Saki (From 'Batla House').mp3",
    "duration": 191
  },
  {
    "title": "Dhaaga",
    "artist": "Nilotpal Bora",
    "imageUrl": "/extracted-covers/nilotpal_bora__hussain_haidry___dhaaga_cover.jpeg",
    "audioUrl": "/songs/Nilotpal Bora, Hussain Haidry - Dhaaga.mp3",
    "duration": 233
  },
  {
    "title": "DIE TRYING",
    "artist": "PARTYNEXTDOOR",
    "imageUrl": "/extracted-covers/partynextdoor__drake__yebba___die_trying_cover.jpeg",
    "audioUrl": "/songs/PARTYNEXTDOOR, Drake, Yebba - DIE TRYING.mp3",
    "duration": 195
  },
  {
    "title": "Chahun Main Ya Naa",
    "artist": "Palak Muchhal",
    "imageUrl": "/extracted-covers/palak_muchhal__arijit_singh___chahun_main_ya_naa_cover.jpeg",
    "audioUrl": "/songs/Palak Muchhal, Arijit Singh - Chahun Main Ya Naa.mp3",
    "duration": 305
  },
  {
    "title": "Tum Hi Aana (From \"Marjaavaan\")",
    "artist": "Payal Dev",
    "imageUrl": "/extracted-covers/payal_dev__jubin_nautiyal__kunaal_vermaa___tum_hi_aana__from__marjaavaan___cover.jpeg",
    "audioUrl": "/songs/Payal Dev, Jubin Nautiyal, Kunaal Vermaa - Tum Hi Aana (From 'Marjaavaan').mp3",
    "duration": 249
  },
  {
    "title": "Playing God",
    "artist": "Polyphia",
    "imageUrl": "/extracted-covers/polyphia___playing_god_cover.jpeg",
    "audioUrl": "/songs/Polyphia - Playing God.mp3",
    "duration": 206
  },
  {
    "title": "Tere Hawale (Arijit - Shreya Duet)",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__amitabh_bhattacharya__arijit_singh__shreya_ghoshal___tere_hawale__arijit___shreya_duet__cover.jpeg",
    "audioUrl": "/songs/Pritam, Amitabh Bhattacharya, Arijit Singh, Shreya Ghoshal - Tere Hawale (Arijit - Shreya Duet).mp3",
    "duration": 348
  },
  {
    "title": "Ae Dil Hai Mushkil Title Track",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh___ae_dil_hai_mushkil_title_track_cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh - Ae Dil Hai Mushkil Title Track.mp3",
    "duration": 269
  },
  {
    "title": "Hawayein",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh___hawayein_cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh - Hawayein.mp3",
    "duration": 290
  },
  {
    "title": "Khairiyat (Bonus Track)",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh___khairiyat__bonus_track__cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh - Khairiyat (Bonus Track).mp3",
    "duration": 271
  },
  {
    "title": "Khairiyat",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh___khairiyat_cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh - Khairiyat.mp3",
    "duration": 280
  },
  {
    "title": "Raabta",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh___raabta_cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh - Raabta.mp3",
    "duration": 244
  },
  {
    "title": "Shayad",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh___shayad_cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh - Shayad.mp3",
    "duration": 221
  },
  {
    "title": "Woh Din",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh___woh_din_cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh - Woh Din.mp3",
    "duration": 258
  },
  {
    "title": "Kesariya (From \"Brahmastra\")",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh__amitabh_bhattacharya___kesariya__from__brahmastra___cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh, Amitabh Bhattacharya - Kesariya (From 'Brahmastra').mp3",
    "duration": 268
  },
  {
    "title": "O Bedardeya (From \"Tu Jhoothi Main Makkaar\")",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh__amitabh_bhattacharya___o_bedardeya__from__tu_jhoothi_main_makkaar___cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh, Amitabh Bhattacharya - O Bedardeya (From 'Tu Jhoothi Main Makkaar').mp3",
    "duration": 313
  },
  {
    "title": "The Breakup Song",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh__badshah__jonita_gandhi__nakash_aziz___the_breakup_song_cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh, Badshah, Jonita Gandhi, Nakash Aziz - The Breakup Song.mp3",
    "duration": 242
  },
  {
    "title": "O Maahi",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh__irshad_kamil___o_maahi_cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh, Irshad Kamil - O Maahi.mp3",
    "duration": 233
  },
  {
    "title": "Aavan Jaavan",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh__nikhita_gandhi__amitabh_bhattacharya___aavan_jaavan_cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh, Nikhita Gandhi, Amitabh Bhattacharya - Aavan Jaavan.mp3",
    "duration": 226
  },
  {
    "title": "Tera Hone Laga Hoon",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__atif_aslam__alisha_chinai___tera_hone_laga_hoon_cover.jpeg",
    "audioUrl": "/songs/Pritam, Atif Aslam, Alisha Chinai - Tera Hone Laga Hoon.mp3",
    "duration": 300
  },
  {
    "title": "Tu Chahiye",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__atif_aslam__amitabh_bhattacharya___tu_chahiye_cover.jpeg",
    "audioUrl": "/songs/Pritam, Atif Aslam, Amitabh Bhattacharya - Tu Chahiye.mp3",
    "duration": 273
  },
  {
    "title": "Ye Tune Kya Kiya",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__javed_bashir___ye_tune_kya_kiya_cover.jpeg",
    "audioUrl": "/songs/Pritam, Javed Bashir - Ye Tune Kya Kiya.mp3",
    "duration": 314
  },
  {
    "title": "Zindagi Kuch Toh Bata (Reprise)",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__jubin_nautiyal__neelesh_misra___zindagi_kuch_toh_bata__reprise__cover.jpeg",
    "audioUrl": "/songs/Pritam, Jubin Nautiyal, Neelesh Misra - Zindagi Kuch Toh Bata (Reprise).mp3",
    "duration": 259
  },
  {
    "title": "Dil Ibaadat",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__kk___dil_ibaadat_cover.jpeg",
    "audioUrl": "/songs/Pritam, KK - Dil Ibaadat.mp3",
    "duration": 327
  },
  {
    "title": "Haan Tu Hain",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__kk___haan_tu_hain_cover.jpeg",
    "audioUrl": "/songs/Pritam, KK - Haan Tu Hain.mp3",
    "duration": 325
  },
  {
    "title": "Labon Ko",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__kk___labon_ko_cover.jpeg",
    "audioUrl": "/songs/Pritam, KK - Labon Ko.mp3",
    "duration": 341
  },
  {
    "title": "Tu Hi Meri Shab Hai - From \"Gangster\"",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__kk___tu_hi_meri_shab_hai___from__gangster__cover.jpeg",
    "audioUrl": "/songs/Pritam, KK - Tu Hi Meri Shab Hai - From 'Gangster'.mp3",
    "duration": 388
  },
  {
    "title": "Zara Sa",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__kk___zara_sa_cover.jpeg",
    "audioUrl": "/songs/Pritam, KK - Zara Sa.mp3",
    "duration": 304
  },
  {
    "title": "Kya Mujhe Pyar Hai",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__kk__neelesh_misra___kya_mujhe_pyar_hai_cover.jpeg",
    "audioUrl": "/songs/Pritam, KK, Neelesh Misra - Kya Mujhe Pyar Hai.mp3",
    "duration": 267
  },
  {
    "title": "Subha Hone Na De",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__mika_singh__shefali_alvares___subha_hone_na_de_cover.jpeg",
    "audioUrl": "/songs/Pritam, Mika Singh, Shefali Alvares - Subha Hone Na De.mp3",
    "duration": 289
  },
  {
    "title": "Tu Mera Hero",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__mika_singh__shefali_alvares___tu_mera_hero_cover.jpeg",
    "audioUrl": "/songs/Pritam, Mika Singh, Shefali Alvares - Tu Mera Hero.mp3",
    "duration": 292
  },
  {
    "title": "Pee Loon",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__mohit_chauhan__irshad_kamil___pee_loon_cover.jpeg",
    "audioUrl": "/songs/Pritam, Mohit Chauhan, Irshad Kamil - Pee Loon.mp3",
    "duration": 286
  },
  {
    "title": "Tum Se Hi",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__mohit_chauhan__irshad_kamil___tum_se_hi_cover.jpeg",
    "audioUrl": "/songs/Pritam, Mohit Chauhan, Irshad Kamil - Tum Se Hi.mp3",
    "duration": 321
  },
  {
    "title": "Character Dheela",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__neeraj_shridhar__amrita_kak___character_dheela_cover.jpeg",
    "audioUrl": "/songs/Pritam, Neeraj Shridhar, Amrita Kak - Character Dheela.mp3",
    "duration": 226
  },
  {
    "title": "Prem Ki Naiyya",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__neeraj_shridhar__suzanne_d_mello___prem_ki_naiyya_cover.jpeg",
    "audioUrl": "/songs/Pritam, Neeraj Shridhar, Suzanne D'Mello - Prem Ki Naiyya.mp3",
    "duration": 251
  },
  {
    "title": "Love Mera Hit Hit",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__neeraj_shridhar__tulsi_kumar__ashish_pandit___love_mera_hit_hit_cover.jpeg",
    "audioUrl": "/songs/Pritam, Neeraj Shridhar, Tulsi Kumar, Ashish Pandit - Love Mera Hit Hit.mp3",
    "duration": 286
  },
  {
    "title": "Jiyein Kyun",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__papon___jiyein_kyun_cover.jpeg",
    "audioUrl": "/songs/Pritam, Papon - Jiyein Kyun.mp3",
    "duration": 265
  },
  {
    "title": "Let It Be",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__shaan___let_it_be_cover.jpeg",
    "audioUrl": "/songs/Pritam, Shaan - Let It Be.mp3",
    "duration": 253
  },
  {
    "title": "Tu Hi Mera",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__shafqat_amanat_ali___tu_hi_mera_cover.jpeg",
    "audioUrl": "/songs/Pritam, Shafqat Amanat Ali - Tu Hi Mera.mp3",
    "duration": 273
  },
  {
    "title": "Allah Maaf Kare",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__sonu_nigam__shilpa_rao___allah_maaf_kare_cover.jpeg",
    "audioUrl": "/songs/Pritam, Sonu Nigam, Shilpa Rao - Allah Maaf Kare.mp3",
    "duration": 227
  },
  {
    "title": "Kabira",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__tochi_raina__rekha_bhardwaj___kabira_cover.jpeg",
    "audioUrl": "/songs/Pritam, Tochi Raina, Rekha Bhardwaj - Kabira.mp3",
    "duration": 223
  },
  {
    "title": "Tareefan",
    "artist": "QARAN",
    "imageUrl": "/extracted-covers/qaran__badshah___tareefan_cover.jpeg",
    "audioUrl": "/songs/QARAN, Badshah - Tareefan.mp3",
    "duration": 193
  },
  {
    "title": "Tere Bin",
    "artist": "Rabbi Shergill",
    "imageUrl": "/extracted-covers/rabbi_shergill___tere_bin_cover.jpeg",
    "audioUrl": "/songs/Rabbi Shergill - Tere Bin.mp3",
    "duration": 323
  },
  {
    "title": "Baby Marvake Maanegi",
    "artist": "Raftaar",
    "imageUrl": "/extracted-covers/raftaar___baby_marvake_maanegi_cover.jpeg",
    "audioUrl": "/songs/Raftaar - Baby Marvake Maanegi.mp3",
    "duration": 188
  },
  {
    "title": "RAASHAH",
    "artist": "Raftaar",
    "imageUrl": "/extracted-covers/raftaar__badshah___raashah_cover.jpeg",
    "audioUrl": "/songs/Raftaar, Badshah - RAASHAH.mp3",
    "duration": 221
  },
  {
    "title": "BAAWE",
    "artist": "Raftaar",
    "imageUrl": "/extracted-covers/raftaar__badshah__hiten___baawe_cover.jpeg",
    "audioUrl": "/songs/Raftaar, Badshah, Hiten - BAAWE.mp3",
    "duration": 159
  },
  {
    "title": "Chora Baba Ka",
    "artist": "Raftaar",
    "imageUrl": "/extracted-covers/raftaar__dhanda_nyoliwala___chora_baba_ka_cover.jpeg",
    "audioUrl": "/songs/Raftaar, Dhanda Nyoliwala - Chora Baba Ka.mp3",
    "duration": 176
  },
  {
    "title": "Haseeno Ka Deewana",
    "artist": "Raftaar",
    "imageUrl": "/extracted-covers/raftaar__payal_dev__gourov_roshin__rajesh_roshan__kumaar__anjaan___haseeno_ka_deewana_cover.jpeg",
    "audioUrl": "/songs/Raftaar, Payal Dev, Gourov-Roshin, Rajesh Roshan, Kumaar, Anjaan - Haseeno Ka Deewana.mp3",
    "duration": 231
  },
  {
    "title": "Ghana Kasoota - Sped Up",
    "artist": "Raftaar",
    "imageUrl": "/extracted-covers/raftaar__rashmeet_kaur__surbhi_jyoti__bollywood_sped_up___ghana_kasoota___sped_up_cover.jpeg",
    "audioUrl": "/songs/Raftaar, Rashmeet Kaur, Surbhi Jyoti, Bollywood Sped Up - Ghana Kasoota - Sped Up.mp3",
    "duration": 135
  },
  {
    "title": "Toh Dishoom",
    "artist": "Raftaar",
    "imageUrl": "/extracted-covers/raftaar__shahid_mallya___toh_dishoom_cover.jpeg",
    "audioUrl": "/songs/Raftaar, Shahid Mallya - Toh Dishoom.mp3",
    "duration": 245
  },
  {
    "title": "All Black",
    "artist": "Raftaar",
    "imageUrl": "/extracted-covers/raftaar__sukh_e_muzical_doctorz__jaani___all_black_cover.jpeg",
    "audioUrl": "/songs/Raftaar, Sukh-E Muzical Doctorz, Jaani - All Black.mp3",
    "duration": 218
  },
  {
    "title": "Dil To Bachcha Hai",
    "artist": "Rahat Fateh Ali Khan",
    "imageUrl": "/extracted-covers/rahat_fateh_ali_khan___dil_to_bachcha_hai_cover.jpeg",
    "audioUrl": "/songs/Rahat Fateh Ali Khan - Dil To Bachcha Hai.mp3",
    "duration": 336
  },
  {
    "title": "Meeting Place",
    "artist": "Ranbir Kapoor",
    "imageUrl": "/extracted-covers/ranbir_kapoor___meeting_place_cover.jpeg",
    "audioUrl": "/songs/Ranbir Kapoor - Meeting Place.mp3",
    "duration": 70
  },
  {
    "title": "Tu Hi Yaar Mera",
    "artist": "Rochak Kohli",
    "imageUrl": "/extracted-covers/rochak_kohli__arijit_singh__neha_kakkar___tu_hi_yaar_mera_cover.jpeg",
    "audioUrl": "/songs/Rochak Kohli, Arijit Singh, Neha Kakkar - Tu Hi Yaar Mera.mp3",
    "duration": 201
  },
  {
    "title": "Humraah (From \"Malang - Unleash The Madness\")",
    "artist": "Sachet Tandon",
    "imageUrl": "/extracted-covers/sachet_tandon__kunaal_vermaa__the_fusion_project___humraah__from__malang___unleash_the_madness___cover.jpeg",
    "audioUrl": "/songs/Sachet Tandon, Kunaal Vermaa, The Fusion Project - Humraah (From 'Malang - Unleash The Madness').mp3",
    "duration": 300
  },
  {
    "title": "Maiyya Mainu",
    "artist": "Sachet Tandon",
    "imageUrl": "/extracted-covers/sachet_tandon__shellee___maiyya_mainu_cover.jpeg",
    "audioUrl": "/songs/Sachet Tandon, Shellee - Maiyya Mainu.mp3",
    "duration": 232
  },
  {
    "title": "Kuchh Na Kaho - Lofi",
    "artist": "Sachin Gupta",
    "imageUrl": "/extracted-covers/sachin_gupta__sanam___kuchh_na_kaho___lofi_cover.jpeg",
    "audioUrl": "/songs/Sachin Gupta, Sanam - Kuchh Na Kaho - Lofi.mp3",
    "duration": 241
  },
  {
    "title": "Apna Bana Le",
    "artist": "Sachin-Jigar",
    "imageUrl": "/extracted-covers/sachin_jigar__arijit_singh__amitabh_bhattacharya___apna_bana_le_cover.jpeg",
    "audioUrl": "/songs/Sachin-Jigar, Arijit Singh, Amitabh Bhattacharya - Apna Bana Le.mp3",
    "duration": 262
  },
  {
    "title": "Phir Aur Kya Chahiye (From \"Zara Hatke Zara Bachke\")",
    "artist": "Sachin-Jigar",
    "imageUrl": "/extracted-covers/sachin_jigar__arijit_singh__amitabh_bhattacharya___phir_aur_kya_chahiye__from__zara_hatke_zara_bachke___cover.jpeg",
    "audioUrl": "/songs/Sachin-Jigar, Arijit Singh, Amitabh Bhattacharya - Phir Aur Kya Chahiye (From 'Zara Hatke Zara Bachke').mp3",
    "duration": 266
  },
  {
    "title": "Jeena Jeena",
    "artist": "Sachin-Jigar",
    "imageUrl": "/extracted-covers/sachin_jigar__atif_aslam__priya_saraiya___jeena_jeena_cover.jpeg",
    "audioUrl": "/songs/Sachin-Jigar, Atif Aslam, Priya Saraiya - Jeena Jeena.mp3",
    "duration": 229
  },
  {
    "title": "Aayi Nai (From \"Stree 2\")",
    "artist": "Sachin-Jigar",
    "imageUrl": "/extracted-covers/sachin_jigar__pawan_singh__simran_choudhary__divya_kumar__amitabh_bhattacharya___aayi_nai__from__stree_2___cover.jpeg",
    "audioUrl": "/songs/Sachin-Jigar, Pawan Singh, Simran Choudhary, Divya Kumar, Amitabh Bhattacharya - Aayi Nai (From 'Stree 2').mp3",
    "duration": 179
  },
  {
    "title": "Aayi Nai",
    "artist": "Sachin-Jigar",
    "imageUrl": "/extracted-covers/sachin_jigar__pawan_singh__simran_choudhary__divya_kumar__amitabh_bhattacharya___aayi_nai_cover.jpeg",
    "audioUrl": "/songs/Sachin-Jigar, Pawan Singh, Simran Choudhary, Divya Kumar, Amitabh Bhattacharya - Aayi Nai.mp3",
    "duration": 179
  },
  {
    "title": "Pardesiya - From \"Param Sundari\"",
    "artist": "Sachin-Jigar",
    "imageUrl": "/extracted-covers/sachin_jigar__sonu_nigam__krishnakali_saha__amitabh_bhattacharya___pardesiya___from__param_sundari__cover.jpeg",
    "audioUrl": "/songs/Sachin-Jigar, Sonu Nigam, Krishnakali Saha, Amitabh Bhattacharya - Pardesiya - From 'Param Sundari'.mp3",
    "duration": 232
  },
  {
    "title": "Surili Akhiyon Wale - Duet",
    "artist": "Sajid-Wajid",
    "imageUrl": "/extracted-covers/sajid_wajid__rahat_fateh_ali_khan__sunidhi_chauhan__suzanne_d_mello__gulzar___surili_akhiyon_wale___duet_cover.jpeg",
    "audioUrl": "/songs/Sajid-Wajid, Rahat Fateh Ali Khan, Sunidhi Chauhan, Suzanne D'Mello, Gulzar - Surili Akhiyon Wale - Duet.mp3",
    "duration": 332
  },
  {
    "title": "Tujh Mein Rab Dikhta Hai",
    "artist": "Salim–Sulaiman",
    "imageUrl": "/extracted-covers/salim_sulaiman__roop_kumar_rathod__jaideep_sahni___tujh_mein_rab_dikhta_hai_cover.jpeg",
    "audioUrl": "/songs/Salim–Sulaiman, Roop Kumar Rathod, Jaideep Sahni - Tujh Mein Rab Dikhta Hai.mp3",
    "duration": 281
  },
  {
    "title": "Shukran Allah",
    "artist": "Salim–Sulaiman",
    "imageUrl": "/extracted-covers/salim_sulaiman__sonu_nigam__shreya_ghoshal__salim_merchant___shukran_allah_cover.jpeg",
    "audioUrl": "/songs/Salim–Sulaiman, Sonu Nigam, Shreya Ghoshal, Salim Merchant - Shukran Allah.mp3",
    "duration": 290
  },
  {
    "title": "Gulabi Aankhen",
    "artist": "Sanam",
    "imageUrl": "/extracted-covers/sanam___gulabi_aankhen_cover.jpeg",
    "audioUrl": "/songs/Sanam - Gulabi Aankhen.mp3",
    "duration": 198
  },
  {
    "title": "Pehla Nasha",
    "artist": "Sanam",
    "imageUrl": "/extracted-covers/sanam___pehla_nasha_cover.jpeg",
    "audioUrl": "/songs/Sanam - Pehla Nasha.mp3",
    "duration": 224
  },
  {
    "title": "Mere Mehboob Qayamat Hogi",
    "artist": "Sanam",
    "imageUrl": "/extracted-covers/sanam__laxmikant_pyarelal___mere_mehboob_qayamat_hogi_cover.jpeg",
    "audioUrl": "/songs/Sanam, Laxmikant–Pyarelal - Mere Mehboob Qayamat Hogi.mp3",
    "duration": 241
  },
  {
    "title": "Yeh Vaada Raha",
    "artist": "Sanam",
    "imageUrl": "/extracted-covers/sanam__mira_mohamed_majid___yeh_vaada_raha_cover.jpeg",
    "audioUrl": "/songs/Sanam, Mira Mohamed Majid - Yeh Vaada Raha.mp3",
    "duration": 183
  },
  {
    "title": "Chala Jata Hoon",
    "artist": "Sanam",
    "imageUrl": "/extracted-covers/sanam__r__d__burman___chala_jata_hoon_cover.jpeg",
    "audioUrl": "/songs/Sanam, R. D. Burman - Chala Jata Hoon.mp3",
    "duration": 210
  },
  {
    "title": "Tujhse Naraz Nahi Zindagi",
    "artist": "Sanam",
    "imageUrl": "/extracted-covers/sanam__r__d__burman___tujhse_naraz_nahi_zindagi_cover.jpeg",
    "audioUrl": "/songs/Sanam, R. D. Burman - Tujhse Naraz Nahi Zindagi.mp3",
    "duration": 238
  },
  {
    "title": "Yeh Raaten Yeh Mausam",
    "artist": "Sanam",
    "imageUrl": "/extracted-covers/sanam__simran_sehgal___yeh_raaten_yeh_mausam_cover.jpeg",
    "audioUrl": "/songs/Sanam, Simran Sehgal - Yeh Raaten Yeh Mausam.mp3",
    "duration": 209
  },
  {
    "title": "11K",
    "artist": "Seedhe Maut",
    "imageUrl": "/extracted-covers/seedhe_maut___11k_cover.jpeg",
    "audioUrl": "/songs/Seedhe Maut - 11K.mp3",
    "duration": 174
  },
  {
    "title": "Namastute",
    "artist": "Seedhe Maut",
    "imageUrl": "/extracted-covers/seedhe_maut___namastute_cover.jpeg",
    "audioUrl": "/songs/Seedhe Maut - Namastute.mp3",
    "duration": 120
  },
  {
    "title": "Raat Ki Rani",
    "artist": "Seedhe Maut",
    "imageUrl": "/extracted-covers/seedhe_maut___raat_ki_rani_cover.jpeg",
    "audioUrl": "/songs/Seedhe Maut - Raat Ki Rani.mp3",
    "duration": 211
  },
  {
    "title": "Luka Chippi",
    "artist": "Seedhe Maut",
    "imageUrl": "/extracted-covers/seedhe_maut__bandzo3rd___luka_chippi_cover.jpeg",
    "audioUrl": "/songs/Seedhe Maut, Bandzo3rd - Luka Chippi.mp3",
    "duration": 142
  },
  {
    "title": "Madira",
    "artist": "Seedhe Maut",
    "imageUrl": "/extracted-covers/seedhe_maut__hurricane__dl91_era___madira_cover.jpeg",
    "audioUrl": "/songs/Seedhe Maut, Hurricane, DL91 Era - Madira.mp3",
    "duration": 170
  },
  {
    "title": "Nanchaku",
    "artist": "Seedhe Maut",
    "imageUrl": "/extracted-covers/seedhe_maut__mc_stan___nanchaku_cover.jpeg",
    "audioUrl": "/songs/Seedhe Maut, MC STAN - Nanchaku.mp3",
    "duration": 193
  },
  {
    "title": "Dus Bahane (From \"Dus\")",
    "artist": "Shaan",
    "imageUrl": "/extracted-covers/shaan__kk___dus_bahane__from__dus___cover.jpeg",
    "audioUrl": "/songs/Shaan, KK - Dus Bahane (From 'Dus').mp3",
    "duration": 207
  },
  {
    "title": "Chand Sifarish",
    "artist": "Shaan",
    "imageUrl": "/extracted-covers/shaan__kailash_kher___chand_sifarish_cover.jpeg",
    "audioUrl": "/songs/Shaan, Kailash Kher - Chand Sifarish.mp3",
    "duration": 276
  },
  {
    "title": "Dil Dil Nazar",
    "artist": "Shaan",
    "imageUrl": "/extracted-covers/shaan__neeraj__shaznine___dil_dil_nazar_cover.jpeg",
    "audioUrl": "/songs/Shaan, Neeraj, Shaznine - Dil Dil Nazar.mp3",
    "duration": 322
  },
  {
    "title": "Chaar Kadam",
    "artist": "Shaan",
    "imageUrl": "/extracted-covers/shaan__shreya_ghoshal__shantanu_moitra__swanand_kirkire___chaar_kadam_cover.jpeg",
    "audioUrl": "/songs/Shaan, Shreya Ghoshal, Shantanu Moitra, Swanand Kirkire - Chaar Kadam.mp3",
    "duration": 243
  },
  {
    "title": "You're My Love",
    "artist": "Shaan",
    "imageUrl": "/extracted-covers/shaan__shweta_pandit__suzi_q__earl_d_souza___you_re_my_love_cover.jpeg",
    "audioUrl": "/songs/Shaan, Shweta Pandit, Suzi Q, Earl D'Souza - You're My Love.mp3",
    "duration": 277
  },
  {
    "title": "Bandeya - From \"Dil Juunglee\"",
    "artist": "Shaarib Toshi",
    "imageUrl": "/extracted-covers/shaarib_toshi__arijit_singh___bandeya___from__dil_juunglee__cover.jpeg",
    "audioUrl": "/songs/Shaarib Toshi, Arijit Singh - Bandeya - From 'Dil Juunglee'.mp3",
    "duration": 185
  },
  {
    "title": "I Don't Know What To Do",
    "artist": "Shabbir Kumar",
    "imageUrl": "/extracted-covers/shabbir_kumar__sunidhi_chauhan___i_don_t_know_what_to_do_cover.jpeg",
    "audioUrl": "/songs/Shabbir Kumar, Sunidhi Chauhan - I Don't Know What To Do.mp3",
    "duration": 199
  },
  {
    "title": "Enna Solla Pogirai",
    "artist": "Shankar Mahadevan",
    "imageUrl": "/extracted-covers/shankar_mahadevan___enna_solla_pogirai_cover.jpeg",
    "audioUrl": "/songs/Shankar Mahadevan - Enna Solla Pogirai.mp3",
    "duration": 361
  },
  {
    "title": "Mitwaa",
    "artist": "Shankar Mahadevan",
    "imageUrl": "/extracted-covers/shankar_mahadevan__jaanvee_prabhu_arora___mitwaa_cover.jpeg",
    "audioUrl": "/songs/Shankar Mahadevan, Jaanvee Prabhu Arora - Mitwaa.mp3",
    "duration": 279
  },
  {
    "title": "Doli Re Doli",
    "artist": "Shankar Mahadevan",
    "imageUrl": "/extracted-covers/shankar_mahadevan__mame_khan___doli_re_doli_cover.jpeg",
    "audioUrl": "/songs/Shankar Mahadevan, Mame Khan - Doli Re Doli.mp3",
    "duration": 333
  },
  {
    "title": "Tere Naina",
    "artist": "Shankar Mahadevan",
    "imageUrl": "/extracted-covers/shankar_mahadevan__shreya_ghoshal___tere_naina_cover.jpeg",
    "audioUrl": "/songs/Shankar Mahadevan, Shreya Ghoshal - Tere Naina.mp3",
    "duration": 257
  },
  {
    "title": "Noor E Khuda",
    "artist": "Shankar-Ehsaan-Loy",
    "imageUrl": "/extracted-covers/shankar_ehsaan_loy__adnan_sami__shankar_mahadevan__shreya_ghoshal___noor_e_khuda_cover.jpeg",
    "audioUrl": "/songs/Shankar-Ehsaan-Loy, Adnan Sami, Shankar Mahadevan, Shreya Ghoshal - Noor E Khuda.mp3",
    "duration": 397
  },
  {
    "title": "Kajra Re",
    "artist": "Shankar-Ehsaan-Loy",
    "imageUrl": "/extracted-covers/shankar_ehsaan_loy__alisha_chinai__shankar_mahadevan__javed_ali__gulzar___kajra_re_cover.jpeg",
    "audioUrl": "/songs/Shankar-Ehsaan-Loy, Alisha Chinai, Shankar Mahadevan, Javed Ali, Gulzar - Kajra Re.mp3",
    "duration": 482
  },
  {
    "title": "Ishq Di Baajiyaan",
    "artist": "Shankar-Ehsaan-Loy",
    "imageUrl": "/extracted-covers/shankar_ehsaan_loy__diljit_dosanjh___ishq_di_baajiyaan_cover.jpeg",
    "audioUrl": "/songs/Shankar-Ehsaan-Loy, Diljit Dosanjh - Ishq Di Baajiyaan.mp3",
    "duration": 287
  },
  {
    "title": "Tere Naina",
    "artist": "Shankar-Ehsaan-Loy",
    "imageUrl": "/extracted-covers/shankar_ehsaan_loy__shafqat_amanat_ali___tere_naina_cover.jpeg",
    "audioUrl": "/songs/Shankar-Ehsaan-Loy, Shafqat Amanat Ali - Tere Naina.mp3",
    "duration": 279
  },
  {
    "title": "O Rangrez",
    "artist": "Shankar-Ehsaan-Loy",
    "imageUrl": "/extracted-covers/shankar_ehsaan_loy__shreya_ghoshal__javed_bashir__yusuf_mohammed__vajid_ali___o_rangrez_cover.jpeg",
    "audioUrl": "/songs/Shankar-Ehsaan-Loy, Shreya Ghoshal, Javed Bashir, Yusuf Mohammed, Vajid Ali - O Rangrez.mp3",
    "duration": 178
  },
  {
    "title": "Zinda",
    "artist": "Shankar-Ehsaan-Loy",
    "imageUrl": "/extracted-covers/shankar_ehsaan_loy__siddharth_mahadevan___zinda_cover.jpeg",
    "audioUrl": "/songs/Shankar-Ehsaan-Loy, Siddharth Mahadevan - Zinda.mp3",
    "duration": 211
  },
  {
    "title": "Slow Motion Angreza",
    "artist": "Shankar-Ehsaan-Loy",
    "imageUrl": "/extracted-covers/shankar_ehsaan_loy__sukhwinder_singh__loy_mendonsa__shankar_mahadevan___slow_motion_angreza_cover.jpeg",
    "audioUrl": "/songs/Shankar-Ehsaan-Loy, Sukhwinder Singh, Loy Mendonsa, Shankar Mahadevan - Slow Motion Angreza.mp3",
    "duration": 260
  },
  {
    "title": "O Shera - Teer Te Taj (Film Version) - From \"Kesari Chapter 2\"",
    "artist": "Shashwat Sachdev",
    "imageUrl": "/extracted-covers/shashwat_sachdev__sangtar__manmohan_waris__kamal_heer__sukhwinder_amrit___o_shera___teer_te_taj__film_version____from__kesari_chapter_2__cover.jpeg",
    "audioUrl": "/songs/Shashwat Sachdev, Sangtar, Manmohan Waris, Kamal Heer, Sukhwinder Amrit - O Shera - Teer Te Taj (Film Version) - From 'Kesari Chapter 2'.mp3",
    "duration": 153
  },
  {
    "title": "Sauda Iss Dil Ka - From \"Sharma Ji Ki Shaadi\"",
    "artist": "Shikhar Saxena",
    "imageUrl": "/extracted-covers/shikhar_saxena___sauda_iss_dil_ka___from__sharma_ji_ki_shaadi__cover.jpeg",
    "audioUrl": "/songs/Shikhar Saxena - Sauda Iss Dil Ka - From 'Sharma Ji Ki Shaadi'.mp3",
    "duration": 207
  },
  {
    "title": "Sunn Raha Hai (Female Version)",
    "artist": "Shreya Ghoshal",
    "imageUrl": "/extracted-covers/shreya_ghoshal___sunn_raha_hai__female_version__cover.jpeg",
    "audioUrl": "/songs/Shreya Ghoshal - Sunn Raha Hai (Female Version).mp3",
    "duration": 315
  },
  {
    "title": "Jaadu Hai Nasha",
    "artist": "Shreya Ghoshal",
    "imageUrl": "/extracted-covers/shreya_ghoshal__shaan__neelesh_misra___jaadu_hai_nasha_cover.jpeg",
    "audioUrl": "/songs/Shreya Ghoshal, Shaan, Neelesh Misra - Jaadu Hai Nasha.mp3",
    "duration": 328
  },
  {
    "title": "295",
    "artist": "Sidhu Moose Wala",
    "imageUrl": "/extracted-covers/sidhu_moose_wala___295_cover.jpeg",
    "audioUrl": "/songs/Sidhu Moose Wala - 295.mp3",
    "duration": 270
  },
  {
    "title": "Dawood",
    "artist": "Sidhu Moose Wala",
    "imageUrl": "/extracted-covers/sidhu_moose_wala___dawood_cover.jpeg",
    "audioUrl": "/songs/Sidhu Moose Wala - Dawood.mp3",
    "duration": 197
  },
  {
    "title": "Death Route",
    "artist": "Sidhu Moose Wala",
    "imageUrl": "/extracted-covers/sidhu_moose_wala___death_route_cover.jpeg",
    "audioUrl": "/songs/Sidhu Moose Wala - Death Route.mp3",
    "duration": 218
  },
  {
    "title": "East Side Flow",
    "artist": "Sidhu Moose Wala",
    "imageUrl": "/extracted-covers/sidhu_moose_wala___east_side_flow_cover.jpeg",
    "audioUrl": "/songs/Sidhu Moose Wala - East Side Flow.mp3",
    "duration": 224
  },
  {
    "title": "Never Fold",
    "artist": "Sidhu Moose Wala",
    "imageUrl": "/extracted-covers/sidhu_moose_wala___never_fold_cover.jpeg",
    "audioUrl": "/songs/Sidhu Moose Wala - Never Fold.mp3",
    "duration": 181
  },
  {
    "title": "Outlaw",
    "artist": "Sidhu Moose Wala",
    "imageUrl": "/extracted-covers/sidhu_moose_wala___outlaw_cover.jpeg",
    "audioUrl": "/songs/Sidhu Moose Wala - Outlaw.mp3",
    "duration": 181
  },
  {
    "title": "0008",
    "artist": "Sidhu Moose Wala",
    "imageUrl": "/extracted-covers/sidhu_moose_wala__jenny_johal__the_kidd___0008_cover.jpeg",
    "audioUrl": "/songs/Sidhu Moose Wala, Jenny Johal, The Kidd - 0008.mp3",
    "duration": 132
  },
  {
    "title": "Lock",
    "artist": "Sidhu Moose Wala",
    "imageUrl": "/extracted-covers/sidhu_moose_wala__the_kidd___lock_cover.jpeg",
    "audioUrl": "/songs/Sidhu Moose Wala, The Kidd - Lock.mp3",
    "duration": 175
  },
  {
    "title": "Madhubala",
    "artist": "Sohail Sen",
    "imageUrl": "/extracted-covers/sohail_sen__ali_zafar__shweta_pandit__irshad_kamil___madhubala_cover.jpeg",
    "audioUrl": "/songs/Sohail Sen, Ali Zafar, Shweta Pandit, Irshad Kamil - Madhubala.mp3",
    "duration": 263
  },
  {
    "title": "Tune Jo Na Kaha",
    "artist": "Sohan Rahman",
    "imageUrl": "/extracted-covers/sohan_rahman__mc_khan___tune_jo_na_kaha_cover.jpeg",
    "audioUrl": "/songs/Sohan Rahman, MC Khan - Tune Jo Na Kaha.mp3",
    "duration": 122
  },
  {
    "title": "Tu",
    "artist": "Sonu Nigam",
    "imageUrl": "/extracted-covers/sonu_nigam___tu_cover.jpeg",
    "audioUrl": "/songs/Sonu Nigam - Tu.mp3",
    "duration": 266
  },
  {
    "title": "Tumse Milke Dil Ka",
    "artist": "Sonu Nigam",
    "imageUrl": "/extracted-covers/sonu_nigam__sabri_brothers___tumse_milke_dil_ka_cover.jpeg",
    "audioUrl": "/songs/Sonu Nigam, Sabri Brothers - Tumse Milke Dil Ka.mp3",
    "duration": 359
  },
  {
    "title": "Chori Kiya Re Jiya",
    "artist": "Sonu Nigam",
    "imageUrl": "/extracted-covers/sonu_nigam__shreya_ghoshal___chori_kiya_re_jiya_cover.jpeg",
    "audioUrl": "/songs/Sonu Nigam, Shreya Ghoshal - Chori Kiya Re Jiya.mp3",
    "duration": 287
  },
  {
    "title": "Dil Dooba (From \"Khakee\")",
    "artist": "Sonu Nigam",
    "imageUrl": "/extracted-covers/sonu_nigam__shreya_ghoshal___dil_dooba__from__khakee___cover.jpeg",
    "audioUrl": "/songs/Sonu Nigam, Shreya Ghoshal - Dil Dooba (From 'Khakee').mp3",
    "duration": 229
  },
  {
    "title": "Dil Dooba",
    "artist": "Sonu Nigam",
    "imageUrl": "/extracted-covers/sonu_nigam__shreya_ghoshal___dil_dooba_cover.jpeg",
    "audioUrl": "/songs/Sonu Nigam, Shreya Ghoshal - Dil Dooba.mp3",
    "duration": 229
  },
  {
    "title": "Main Agar Kahoon",
    "artist": "Sonu Nigam",
    "imageUrl": "/extracted-covers/sonu_nigam__shreya_ghoshal___main_agar_kahoon_cover.jpeg",
    "audioUrl": "/songs/Sonu Nigam, Shreya Ghoshal - Main Agar Kahoon.mp3",
    "duration": 308
  },
  {
    "title": "Zoobi Doobi",
    "artist": "Sonu Nigam",
    "imageUrl": "/extracted-covers/sonu_nigam__shreya_ghoshal___zoobi_doobi_cover.jpeg",
    "audioUrl": "/songs/Sonu Nigam, Shreya Ghoshal - Zoobi Doobi.mp3",
    "duration": 246
  },
  {
    "title": "Toota Jo Kabhi Tara",
    "artist": "Sumedha Karmahe",
    "imageUrl": "/extracted-covers/sumedha_karmahe__atif_aslam___toota_jo_kabhi_tara_cover.jpeg",
    "audioUrl": "/songs/Sumedha Karmahe, Atif Aslam - Toota Jo Kabhi Tara.mp3",
    "duration": 305
  },
  {
    "title": "Halka Halka",
    "artist": "Sunidhi Chauhan",
    "imageUrl": "/extracted-covers/sunidhi_chauhan__divya_kumar__amit_trivedi___halka_halka_cover.jpeg",
    "audioUrl": "/songs/Sunidhi Chauhan, Divya Kumar, Amit Trivedi - Halka Halka.mp3",
    "duration": 135
  },
  {
    "title": "Sheila Ki Jawani (From \"Tees Maar Khan\")",
    "artist": "Sunidhi Chauhan",
    "imageUrl": "/extracted-covers/sunidhi_chauhan__vishal_dadlani___sheila_ki_jawani__from__tees_maar_khan___cover.jpeg",
    "audioUrl": "/songs/Sunidhi Chauhan, Vishal Dadlani - Sheila Ki Jawani (From 'Tees Maar Khan').mp3",
    "duration": 282
  },
  {
    "title": "Illuminati - From \"Aavesham\"",
    "artist": "Sushin Shyam",
    "imageUrl": "/extracted-covers/sushin_shyam__dabzee__vinayak_sasikumar___illuminati___from__aavesham__cover.jpeg",
    "audioUrl": "/songs/Sushin Shyam, Dabzee, Vinayak Sasikumar - Illuminati - From 'Aavesham'.mp3",
    "duration": 213
  },
  {
    "title": "Farq hai",
    "artist": "Suzonn",
    "imageUrl": "/extracted-covers/suzonn___farq_hai_cover.jpeg",
    "audioUrl": "/songs/Suzonn - Farq hai.mp3",
    "duration": 184
  },
  {
    "title": "Kho Gaye",
    "artist": "Taaruk Raina",
    "imageUrl": "/extracted-covers/taaruk_raina__mismatched___cast___kho_gaye_cover.jpeg",
    "audioUrl": "/songs/Taaruk Raina, Mismatched - Cast - Kho Gaye.mp3",
    "duration": 198
  },
  {
    "title": "Itna Na Mujhse Tu Pyar Badha",
    "artist": "Talat Mahmood",
    "imageUrl": "/extracted-covers/talat_mahmood__lata_mangeshkar___itna_na_mujhse_tu_pyar_badha_cover.jpeg",
    "audioUrl": "/songs/Talat Mahmood, Lata Mangeshkar - Itna Na Mujhse Tu Pyar Badha.mp3",
    "duration": 235
  },
  {
    "title": "Leja Re",
    "artist": "Tanishk Bagchi",
    "imageUrl": "/extracted-covers/tanishk_bagchi__dhvani_bhanushali__rashmi_virag___leja_re_cover.jpeg",
    "audioUrl": "/songs/Tanishk Bagchi, Dhvani Bhanushali, Rashmi Virag - Leja Re.mp3",
    "duration": 206
  },
  {
    "title": "Saiyaara Reprise - Female",
    "artist": "Tanishk Bagchi",
    "imageUrl": "/extracted-covers/tanishk_bagchi__faheem_abdullah__arslan_nizami__shreya_ghoshal__irshad_kamil___saiyaara_reprise___female_cover.jpeg",
    "audioUrl": "/songs/Tanishk Bagchi, Faheem Abdullah, Arslan Nizami, Shreya Ghoshal, Irshad Kamil - Saiyaara Reprise - Female.mp3",
    "duration": 183
  },
  {
    "title": "Raataan Lambiyan (From \"Shershaah\")",
    "artist": "Tanishk Bagchi",
    "imageUrl": "/extracted-covers/tanishk_bagchi__jubin_nautiyal__asees_kaur___raataan_lambiyan__from__shershaah___cover.jpeg",
    "audioUrl": "/songs/Tanishk Bagchi, Jubin Nautiyal, Asees Kaur - Raataan Lambiyan (From 'Shershaah').mp3",
    "duration": 230
  },
  {
    "title": "Laal Peeli Akhiyaan (From \"Teri Baaton Mein Aisa Uljha Jiya\")",
    "artist": "Tanishk Bagchi",
    "imageUrl": "/extracted-covers/tanishk_bagchi__romy__neeraj_rajawat___laal_peeli_akhiyaan__from__teri_baaton_mein_aisa_uljha_jiya___cover.jpeg",
    "audioUrl": "/songs/Tanishk Bagchi, Romy, Neeraj Rajawat - Laal Peeli Akhiyaan (From 'Teri Baaton Mein Aisa Uljha Jiya').mp3",
    "duration": 188
  },
  {
    "title": "Har Funn Maula (From \"Koi Jaane Na\")",
    "artist": "Tanishk Bagchi",
    "imageUrl": "/extracted-covers/tanishk_bagchi__vishal_dadlani__zahrah_s_khan___har_funn_maula__from__koi_jaane_na___cover.jpeg",
    "audioUrl": "/songs/Tanishk Bagchi, Vishal Dadlani, Zahrah S Khan - Har Funn Maula (From 'Koi Jaane Na').mp3",
    "duration": 247
  },
  {
    "title": "Blank Space",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___blank_space_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - Blank Space.mp3",
    "duration": 232
  },
  {
    "title": "Cruel Summer",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___cruel_summer_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - Cruel Summer.mp3",
    "duration": 178
  },
  {
    "title": "Don’t Blame Me",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___don_t_blame_me_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - Don’t Blame Me.mp3",
    "duration": 236
  },
  {
    "title": "Lover",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___lover_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - Lover.mp3",
    "duration": 221
  },
  {
    "title": "Shake It Off",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___shake_it_off_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - Shake It Off.mp3",
    "duration": 219
  },
  {
    "title": "Style",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___style_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - Style.mp3",
    "duration": 231
  },
  {
    "title": "august",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___august_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - august.mp3",
    "duration": 262
  },
  {
    "title": "cardigan",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___cardigan_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - cardigan.mp3",
    "duration": 240
  },
  {
    "title": "Saints of the Sinners",
    "artist": "The Faim",
    "imageUrl": "/extracted-covers/the_faim___saints_of_the_sinners_cover.jpeg",
    "audioUrl": "/songs/The Faim - Saints of the Sinners.mp3",
    "duration": 183
  },
  {
    "title": "STAY",
    "artist": "The Kid LAROI",
    "imageUrl": "/extracted-covers/the_kid_laroi__justin_bieber___stay_cover.jpeg",
    "audioUrl": "/songs/The Kid LAROI, Justin Bieber - STAY.mp3",
    "duration": 142
  },
  {
    "title": "Blinding Lights",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd___blinding_lights_cover.jpeg",
    "audioUrl": "/songs/The Weeknd - Blinding Lights.mp3",
    "duration": 202
  },
  {
    "title": "Call Out My Name",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd___call_out_my_name_cover.jpeg",
    "audioUrl": "/songs/The Weeknd - Call Out My Name.mp3",
    "duration": 228
  },
  {
    "title": "Cry For Me",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd___cry_for_me_cover.jpeg",
    "audioUrl": "/songs/The Weeknd - Cry For Me.mp3",
    "duration": 224
  },
  {
    "title": "Die For You",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd___die_for_you_cover.jpeg",
    "audioUrl": "/songs/The Weeknd - Die For You.mp3",
    "duration": 260
  },
  {
    "title": "Save Your Tears",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd___save_your_tears_cover.jpeg",
    "audioUrl": "/songs/The Weeknd - Save Your Tears.mp3",
    "duration": 216
  },
  {
    "title": "The Hills",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd___the_hills_cover.jpeg",
    "audioUrl": "/songs/The Weeknd - The Hills.mp3",
    "duration": 242
  },
  {
    "title": "São Paulo (feat. Anitta) - Single Version",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd__anitta___s_o_paulo__feat__anitta____single_version_cover.jpeg",
    "audioUrl": "/songs/The Weeknd, Anitta - São Paulo (feat. Anitta) - Single Version.mp3",
    "duration": 149
  },
  {
    "title": "São Paulo (feat. Anitta)",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd__anitta___s_o_paulo__feat__anitta__cover.jpeg",
    "audioUrl": "/songs/The Weeknd, Anitta - São Paulo (feat. Anitta).mp3",
    "duration": 302
  },
  {
    "title": "Timeless (feat. Playboi Carti & Doechii) - Remix",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd__doechii__playboi_carti___timeless__feat__playboi_carti___doechii____remix_cover.jpeg",
    "audioUrl": "/songs/The Weeknd, Doechii, Playboi Carti - Timeless (feat. Playboi Carti & Doechii) - Remix.mp3",
    "duration": 228
  },
  {
    "title": "Timeless (feat Playboi Carti)",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd__playboi_carti___timeless__feat_playboi_carti__cover.jpeg",
    "audioUrl": "/songs/The Weeknd, Playboi Carti - Timeless (feat Playboi Carti).mp3",
    "duration": 256
  },
  {
    "title": "Zindagi Bata De",
    "artist": "Tony Kakkar",
    "imageUrl": "/extracted-covers/tony_kakkar___zindagi_bata_de_cover.jpeg",
    "audioUrl": "/songs/Tony Kakkar - Zindagi Bata De.mp3",
    "duration": 156
  },
  {
    "title": "4X4",
    "artist": "Travis Scott",
    "imageUrl": "/extracted-covers/travis_scott___4x4_cover.jpeg",
    "audioUrl": "/songs/Travis Scott - 4X4.mp3",
    "duration": 191
  },
  {
    "title": "HIGHEST IN THE ROOM",
    "artist": "Travis Scott",
    "imageUrl": "/extracted-covers/travis_scott___highest_in_the_room_cover.jpeg",
    "audioUrl": "/songs/Travis Scott - HIGHEST IN THE ROOM.mp3",
    "duration": 176
  },
  {
    "title": "SICKO MODE",
    "artist": "Travis Scott",
    "imageUrl": "/extracted-covers/travis_scott___sicko_mode_cover.jpeg",
    "audioUrl": "/songs/Travis Scott - SICKO MODE.mp3",
    "duration": 313
  },
  {
    "title": "goosebumps",
    "artist": "Travis Scott",
    "imageUrl": "/extracted-covers/travis_scott___goosebumps_cover.jpeg",
    "audioUrl": "/songs/Travis Scott - goosebumps.mp3",
    "duration": 244
  },
  {
    "title": "Maria I'm Drunk (feat. Justin Bieber & Young Thug)",
    "artist": "Travis Scott",
    "imageUrl": "/extracted-covers/travis_scott__justin_bieber__young_thug___maria_i_m_drunk__feat__justin_bieber___young_thug__cover.jpeg",
    "audioUrl": "/songs/Travis Scott, Justin Bieber, Young Thug - Maria I'm Drunk (feat. Justin Bieber & Young Thug).mp3",
    "duration": 350
  },
  {
    "title": "90210 (feat. Kacy Hill)",
    "artist": "Travis Scott",
    "imageUrl": "/extracted-covers/travis_scott__kacy_hill___90210__feat__kacy_hill__cover.jpeg",
    "audioUrl": "/songs/Travis Scott, Kacy Hill - 90210 (feat. Kacy Hill).mp3",
    "duration": 339
  },
  {
    "title": "Nightcrawler (feat. Swae Lee & Chief Keef)",
    "artist": "Travis Scott",
    "imageUrl": "/extracted-covers/travis_scott__swae_lee__chief_keef___nightcrawler__feat__swae_lee___chief_keef__cover.jpeg",
    "audioUrl": "/songs/Travis Scott, Swae Lee, Chief Keef - Nightcrawler (feat. Swae Lee & Chief Keef).mp3",
    "duration": 322
  },
  {
    "title": "Dil Ne Yeh Kaha Hain Dil Se",
    "artist": "Udit Narayan",
    "imageUrl": "/extracted-covers/udit_narayan__alka_yagnik___dil_ne_yeh_kaha_hain_dil_se_cover.jpeg",
    "audioUrl": "/songs/Udit Narayan, Alka Yagnik - Dil Ne Yeh Kaha Hain Dil Se.mp3",
    "duration": 427
  },
  {
    "title": "Jugraafiya - From \"Super 30\"",
    "artist": "Udit Narayan",
    "imageUrl": "/extracted-covers/udit_narayan__shreya_ghoshal___jugraafiya___from__super_30__cover.jpeg",
    "audioUrl": "/songs/Udit Narayan, Shreya Ghoshal - Jugraafiya - From 'Super 30'.mp3",
    "duration": 274
  },
  {
    "title": "Le Gayi",
    "artist": "Uttam Singh",
    "imageUrl": "/extracted-covers/uttam_singh__asha_bhosle__anand_bakshi___le_gayi_cover.jpeg",
    "audioUrl": "/songs/Uttam Singh, Asha Bhosle, Anand Bakshi - Le Gayi.mp3",
    "duration": 341
  },
  {
    "title": "Tere Vaaste (From \"Zara Hatke Zara Bachke\")",
    "artist": "Varun Jain",
    "imageUrl": "/extracted-covers/varun_jain__sachin_jigar__shadab_faridi__altamash_faridi__amitabh_bhattacharya___tere_vaaste__from__zara_hatke_zara_bachke___cover.jpeg",
    "audioUrl": "/songs/Varun Jain, Sachin-Jigar, Shadab Faridi, Altamash Faridi, Amitabh Bhattacharya - Tere Vaaste (From 'Zara Hatke Zara Bachke').mp3",
    "duration": 189
  },
  {
    "title": "Namak",
    "artist": "Vishal Bhardwaj",
    "imageUrl": "/extracted-covers/vishal_bhardwaj__rekha_bhardwaj__rakesh_pandit__gulzar___namak_cover.jpeg",
    "audioUrl": "/songs/Vishal Bhardwaj, Rekha Bhardwaj, Rakesh Pandit, Gulzar - Namak.mp3",
    "duration": 413
  },
  {
    "title": "Pehle Bhi Main",
    "artist": "Vishal Mishra",
    "imageUrl": "/extracted-covers/vishal_mishra__raj_shekhar___pehle_bhi_main_cover.jpeg",
    "audioUrl": "/songs/Vishal Mishra, Raj Shekhar - Pehle Bhi Main.mp3",
    "duration": 250
  },
  {
    "title": "Ishq Sufiyana",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar___ishq_sufiyana_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar - Ishq Sufiyana.mp3",
    "duration": 328
  },
  {
    "title": "Chashni",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__abhijeet_srivastava___chashni_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Abhijeet Srivastava - Chashni.mp3",
    "duration": 266
  },
  {
    "title": "Criminal",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__akon__vishal_dadlani__shruti_pathak__kumaar___criminal_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Akon, Vishal Dadlani, Shruti Pathak, Kumaar - Criminal.mp3",
    "duration": 307
  },
  {
    "title": "Tera Rastaa Chhodoon Na",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__amitabh_bhattacharya__anusha_mani___tera_rastaa_chhodoon_na_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Amitabh Bhattacharya, Anusha Mani - Tera Rastaa Chhodoon Na.mp3",
    "duration": 253
  },
  {
    "title": "Ghungroo (From \"War\")",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__arijit_singh__shilpa_rao__kumaar___ghungroo__from__war___cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Arijit Singh, Shilpa Rao, Kumaar - Ghungroo (From 'War').mp3",
    "duration": 303
  },
  {
    "title": "Dil Diyan Gallan",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__atif_aslam__irshad_kamil___dil_diyan_gallan_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Atif Aslam, Irshad Kamil - Dil Diyan Gallan.mp3",
    "duration": 261
  },
  {
    "title": "Zehnaseeb",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__chinmayi__shekhar_ravjiani___zehnaseeb_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Chinmayi, Shekhar Ravjiani - Zehnaseeb.mp3",
    "duration": 217
  },
  {
    "title": "Ajab Si",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__kk___ajab_si_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, KK - Ajab Si.mp3",
    "duration": 242
  },
  {
    "title": "Khuda Jaane",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__kk__shilpa_rao__anvita_dutt_guptan___khuda_jaane_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, KK, Shilpa Rao, Anvita Dutt Guptan - Khuda Jaane.mp3",
    "duration": 333
  },
  {
    "title": "Ishq Sufiyana (Male)",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__kamal_khan___ishq_sufiyana__male__cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Kamal Khan - Ishq Sufiyana (Male).mp3",
    "duration": 325
  },
  {
    "title": "Tujhe Bhula Diya",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__mohit_chauhan__shekhar_ravjiani__shruti_pathak___tujhe_bhula_diya_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Mohit Chauhan, Shekhar Ravjiani, Shruti Pathak - Tujhe Bhula Diya.mp3",
    "duration": 279
  },
  {
    "title": "Bulleya",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__papon__irshad_kamil___bulleya_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Papon, Irshad Kamil - Bulleya.mp3",
    "duration": 357
  },
  {
    "title": "Ishq Bulaava",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__sanam_puri__shipra_goyal___ishq_bulaava_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Sanam Puri, Shipra Goyal - Ishq Bulaava.mp3",
    "duration": 304
  },
  {
    "title": "My Dil Goes Mmmm",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__shaan__gayatri_iyer__jaideep_sahni___my_dil_goes_mmmm_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Shaan, Gayatri Iyer, Jaideep Sahni - My Dil Goes Mmmm.mp3",
    "duration": 452
  },
  {
    "title": "Dildaara (Stand By Me)",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__shafqat_amanat_ali__kumaar___dildaara__stand_by_me__cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Shafqat Amanat Ali, Kumaar - Dildaara (Stand By Me).mp3",
    "duration": 250
  },
  {
    "title": "Manchala",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__shafqat_amanat_ali__nupur_pant___manchala_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Shafqat Amanat Ali, Nupur Pant - Manchala.mp3",
    "duration": 228
  },
  {
    "title": "Kukkad",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__shahid_mallya__nisha_mascarenhas__marianne_d_cruz_aiman___kukkad_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Shahid Mallya, Nisha Mascarenhas, Marianne D'Cruz Aiman - Kukkad.mp3",
    "duration": 263
  },
  {
    "title": "Ishq Wala Love",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__shekhar_ravjiani__salim_merchant__neeti_mohan___ishq_wala_love_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Shekhar Ravjiani, Salim Merchant, Neeti Mohan - Ishq Wala Love.mp3",
    "duration": 258
  },
  {
    "title": "One Two Three Four (Get On The Dance Floor)",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__vishal_dadlani__hamsika_iyer___one_two_three_four__get_on_the_dance_floor__cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Vishal Dadlani, Hamsika Iyer - One Two Three Four (Get On The Dance Floor).mp3",
    "duration": 228
  },
  {
    "title": "Vele",
    "artist": "Vishal-Shekhar",
    "imageUrl": "/extracted-covers/vishal_shekhar__vishal_dadlani__shekhar_ravjiani___vele_cover.jpeg",
    "audioUrl": "/songs/Vishal-Shekhar, Vishal Dadlani, Shekhar Ravjiani - Vele.mp3",
    "duration": 231
  },
  {
    "title": "Soni De Nakhre",
    "artist": "Wajid",
    "imageUrl": "/extracted-covers/wajid__labh_janjua__sneha_pant___soni_de_nakhre_cover.jpeg",
    "audioUrl": "/songs/Wajid, Labh Janjua, Sneha Pant - Soni De Nakhre.mp3",
    "duration": 259
  },
  {
    "title": "Right Now Now",
    "artist": "Wajid",
    "imageUrl": "/extracted-covers/wajid__sunidhi_chauhan__suzanne_d_mello___right_now_now_cover.jpeg",
    "audioUrl": "/songs/Wajid, Sunidhi Chauhan, Suzanne D'Mello - Right Now Now.mp3",
    "duration": 246
  },
  {
    "title": "Mere Humsafar (Original Score) [Female Version]",
    "artist": "Yashal Shahid",
    "imageUrl": "/extracted-covers/yashal_shahid___mere_humsafar__original_score___female_version__cover.jpeg",
    "audioUrl": "/songs/Yashal Shahid - Mere Humsafar (Original Score) [Female Version].mp3",
    "duration": 351
  },
  {
    "title": "Gallan Goodiyaan",
    "artist": "Yashita Sharma",
    "imageUrl": "/extracted-covers/yashita_sharma__manish_kumar_tipu__farhan_akhtar__shankar_mahadevan__sukhwinder_singh___gallan_goodiyaan_cover.jpeg",
    "audioUrl": "/songs/Yashita Sharma, Manish Kumar Tipu, Farhan Akhtar, Shankar Mahadevan, Sukhwinder Singh - Gallan Goodiyaan.mp3",
    "duration": 297
  },
  {
    "title": "Dhundhala",
    "artist": "Yashraj",
    "imageUrl": "/extracted-covers/yashraj__dropped_out__talwiinder___dhundhala_cover.jpeg",
    "audioUrl": "/songs/Yashraj, Dropped Out, Talwiinder - Dhundhala.mp3",
    "duration": 182
  },
  {
    "title": "Blue Eyes",
    "artist": "Yo Yo Honey Singh",
    "imageUrl": "/extracted-covers/yo_yo_honey_singh___blue_eyes_cover.jpeg",
    "audioUrl": "/songs/Yo Yo Honey Singh - Blue Eyes.mp3",
    "duration": 221
  },
  {
    "title": "Desi Kalakaar",
    "artist": "Yo Yo Honey Singh",
    "imageUrl": "/extracted-covers/yo_yo_honey_singh___desi_kalakaar_cover.jpeg",
    "audioUrl": "/songs/Yo Yo Honey Singh - Desi Kalakaar.mp3",
    "duration": 253
  },
  {
    "title": "Love Dose",
    "artist": "Yo Yo Honey Singh",
    "imageUrl": "/extracted-covers/yo_yo_honey_singh___love_dose_cover.jpeg",
    "audioUrl": "/songs/Yo Yo Honey Singh - Love Dose.mp3",
    "duration": 224
  },
  {
    "title": "Lungi Dance",
    "artist": "Yo Yo Honey Singh",
    "imageUrl": "/extracted-covers/yo_yo_honey_singh___lungi_dance_cover.jpeg",
    "audioUrl": "/songs/Yo Yo Honey Singh - Lungi Dance.mp3",
    "duration": 275
  },
  {
    "title": "Millionaire",
    "artist": "Yo Yo Honey Singh",
    "imageUrl": "/extracted-covers/yo_yo_honey_singh___millionaire_cover.jpeg",
    "audioUrl": "/songs/Yo Yo Honey Singh - Millionaire.mp3",
    "duration": 199
  },
  {
    "title": "Yaar Naa Miley (From \"Kick\")",
    "artist": "Yo Yo Honey Singh",
    "imageUrl": "/extracted-covers/yo_yo_honey_singh__jasmine_sandlas___yaar_naa_miley__from__kick___cover.jpeg",
    "audioUrl": "/songs/Yo Yo Honey Singh, Jasmine Sandlas - Yaar Naa Miley (From 'Kick').mp3",
    "duration": 243
  },
  {
    "title": "Manali Trance",
    "artist": "Yo Yo Honey Singh",
    "imageUrl": "/extracted-covers/yo_yo_honey_singh__neha_kakkar___manali_trance_cover.jpeg",
    "audioUrl": "/songs/Yo Yo Honey Singh, Neha Kakkar - Manali Trance.mp3",
    "duration": 203
  },
  {
    "title": "Sunny Sunny",
    "artist": "Yo Yo Honey Singh",
    "imageUrl": "/extracted-covers/yo_yo_honey_singh__neha_kakkar___sunny_sunny_cover.jpeg",
    "audioUrl": "/songs/Yo Yo Honey Singh, Neha Kakkar - Sunny Sunny.mp3",
    "duration": 243
  },
  {
    "title": "Chhote Chhote Peg (From \"Sonu Ke Titu Ki Sweety\")",
    "artist": "Yo Yo Honey Singh",
    "imageUrl": "/extracted-covers/yo_yo_honey_singh__neha_kakkar__navraj_hans__anand_raj_anand___chhote_chhote_peg__from__sonu_ke_titu_ki_sweety___cover.jpeg",
    "audioUrl": "/songs/Yo Yo Honey Singh, Neha Kakkar, Navraj Hans, Anand Raj Anand - Chhote Chhote Peg (From 'Sonu Ke Titu Ki Sweety').mp3",
    "duration": 204
  },
  {
    "title": "Renegade",
    "artist": "Aaryan Shah",
    "imageUrl": "/extracted-covers/aaryan_shah___renegade_cover.jpeg",
    "audioUrl": "/songs/Aaryan Shah - Renegade.mp3",
    "duration": 223
  },
  {
    "title": "Locked Away",
    "artist": "Adam Lang",
    "imageUrl": "/extracted-covers/adam_lang___locked_away_cover.jpeg",
    "audioUrl": "/songs/Adam Lang - Locked Away.mp3",
    "duration": 227
  },
  {
    "title": "Paaro",
    "artist": "Aditya Rikhari",
    "imageUrl": "/extracted-covers/aditya_rikhari___paaro_cover.jpeg",
    "audioUrl": "/songs/Aditya Rikhari - Paaro.mp3",
    "duration": 153
  },
  {
    "title": "Lonely",
    "artist": "Akon",
    "imageUrl": "/extracted-covers/akon___lonely_cover.jpeg",
    "audioUrl": "/songs/Akon - Lonely.mp3",
    "duration": 236
  },
  {
    "title": "Best Day Of My Life",
    "artist": "American Authors",
    "imageUrl": "/extracted-covers/american_authors___best_day_of_my_life_cover.jpeg",
    "audioUrl": "/songs/American Authors - Best Day Of My Life.mp3",
    "duration": 194
  },
  {
    "title": "Why'd You Only Call Me When You're High?",
    "artist": "Arctic Monkeys",
    "imageUrl": "/extracted-covers/arctic_monkeys___why_d_you_only_call_me_when_you_re_high_cover.jpeg",
    "audioUrl": "/songs/Arctic Monkeys - Why'd You Only Call Me When You're High.mp3",
    "duration": 161
  },
  {
    "title": "BABYDOLL",
    "artist": "Ari Abdul",
    "imageUrl": "/extracted-covers/ari_abdul___babydoll_cover.jpeg",
    "audioUrl": "/songs/Ari Abdul - BABYDOLL.mp3",
    "duration": 196
  },
  {
    "title": "Stuck with U (with Justin Bieber)",
    "artist": "Ariana Grande",
    "imageUrl": "/extracted-covers/ariana_grande__justin_bieber___stuck_with_u__with_justin_bieber__cover.jpeg",
    "audioUrl": "/songs/Ariana Grande, Justin Bieber - Stuck with U (with Justin Bieber).mp3",
    "duration": 229
  },
  {
    "title": "Hurts So Good",
    "artist": "Astrid S",
    "imageUrl": "/extracted-covers/astrid_s___hurts_so_good_cover.jpeg",
    "audioUrl": "/songs/Astrid S - Hurts So Good.mp3",
    "duration": 209
  },
  {
    "title": "C.R.E.A.M POSSE",
    "artist": "Baggh-e SMG",
    "imageUrl": "/extracted-covers/baggh_e_smg__farmaan_smg__big_kay_smg___c_r_e_a_m_posse_cover.jpeg",
    "audioUrl": "/songs/Baggh-e SMG, Farmaan SMG, BIG KAY SMG - C.R.E.A.M POSSE.mp3",
    "duration": 206
  },
  {
    "title": "Cloud 9",
    "artist": "Beach Bunny",
    "imageUrl": "/extracted-covers/beach_bunny___cloud_9_cover.jpeg",
    "audioUrl": "/songs/Beach Bunny - Cloud 9.mp3",
    "duration": 147
  },
  {
    "title": "Sex, Drugs, Etc.",
    "artist": "Beach Weather",
    "imageUrl": "/extracted-covers/beach_weather___sex__drugs__etc__cover.jpeg",
    "audioUrl": "/songs/Beach Weather - Sex, Drugs, Etc..mp3",
    "duration": 197
  },
  {
    "title": "Bored",
    "artist": "Billie Eilish",
    "imageUrl": "/extracted-covers/billie_eilish___bored_cover.jpeg",
    "audioUrl": "/songs/Billie Eilish - Bored.mp3",
    "duration": 181
  },
  {
    "title": "It Will Rain",
    "artist": "Bruno Mars",
    "imageUrl": "/extracted-covers/bruno_mars___it_will_rain_cover.jpeg",
    "audioUrl": "/songs/Bruno Mars - It Will Rain.mp3",
    "duration": 258
  },
  {
    "title": "Talking to the Moon",
    "artist": "Bruno Mars",
    "imageUrl": "/extracted-covers/bruno_mars___talking_to_the_moon_cover.jpeg",
    "audioUrl": "/songs/Bruno Mars - Talking to the Moon.mp3",
    "duration": 218
  },
  {
    "title": "Shameless",
    "artist": "Camila Cabello",
    "imageUrl": "/extracted-covers/camila_cabello___shameless_cover.jpeg",
    "audioUrl": "/songs/Camila Cabello - Shameless.mp3",
    "duration": 220
  },
  {
    "title": "Long Way 2 Go",
    "artist": "Cassie",
    "imageUrl": "/extracted-covers/cassie___long_way_2_go_cover.jpeg",
    "audioUrl": "/songs/Cassie - Long Way 2 Go.mp3",
    "duration": 223
  },
  {
    "title": "Friends",
    "artist": "Chase Atlantic",
    "imageUrl": "/extracted-covers/chase_atlantic___friends_cover.jpeg",
    "audioUrl": "/songs/Chase Atlantic - Friends.mp3",
    "duration": 230
  },
  {
    "title": "Into It",
    "artist": "Chase Atlantic",
    "imageUrl": "/extracted-covers/chase_atlantic___into_it_cover.jpeg",
    "audioUrl": "/songs/Chase Atlantic - Into It.mp3",
    "duration": 197
  },
  {
    "title": "Swim",
    "artist": "Chase Atlantic",
    "imageUrl": "/extracted-covers/chase_atlantic___swim_cover.jpeg",
    "audioUrl": "/songs/Chase Atlantic - Swim.mp3",
    "duration": 229
  },
  {
    "title": "Consume (feat. Goon Des Garcons)",
    "artist": "Chase Atlantic",
    "imageUrl": "/extracted-covers/chase_atlantic__goon_des_garcons___consume__feat__goon_des_garcons__cover.jpeg",
    "audioUrl": "/songs/Chase Atlantic, GOON DES GARCONS - Consume (feat. Goon Des Garcons).mp3",
    "duration": 268
  },
  {
    "title": "Beanie",
    "artist": "Chezile",
    "imageUrl": "/extracted-covers/chezile___beanie_cover.jpeg",
    "audioUrl": "/songs/Chezile - Beanie.mp3",
    "duration": 132
  },
  {
    "title": "Under The Influence",
    "artist": "Chris Brown",
    "imageUrl": "/extracted-covers/chris_brown___under_the_influence_cover.jpeg",
    "audioUrl": "/songs/Chris Brown - Under The Influence.mp3",
    "duration": 185
  },
  {
    "title": "Apocalypse",
    "artist": "Cigarettes After Sex",
    "imageUrl": "/extracted-covers/cigarettes_after_sex___apocalypse_cover.jpeg",
    "audioUrl": "/songs/Cigarettes After Sex - Apocalypse.mp3",
    "duration": 290
  },
  {
    "title": "Sofia",
    "artist": "Clairo",
    "imageUrl": "/extracted-covers/clairo___sofia_cover.jpeg",
    "audioUrl": "/songs/Clairo - Sofia.mp3",
    "duration": 188
  },
  {
    "title": "Heather",
    "artist": "Conan Gray",
    "imageUrl": "/extracted-covers/conan_gray___heather_cover.jpeg",
    "audioUrl": "/songs/Conan Gray - Heather.mp3",
    "duration": 198
  },
  {
    "title": "Wish You Were Sober",
    "artist": "Conan Gray",
    "imageUrl": "/extracted-covers/conan_gray___wish_you_were_sober_cover.jpeg",
    "audioUrl": "/songs/Conan Gray - Wish You Were Sober.mp3",
    "duration": 169
  },
  {
    "title": "Baazigar",
    "artist": "DIVINE",
    "imageUrl": "/extracted-covers/divine__armani_white___baazigar_cover.jpeg",
    "audioUrl": "/songs/DIVINE, Armani White - Baazigar.mp3",
    "duration": 169
  },
  {
    "title": "Six Days - Remix",
    "artist": "DJ Shadow",
    "imageUrl": "/extracted-covers/dj_shadow__mos_def___six_days___remix_cover.jpeg",
    "audioUrl": "/songs/DJ Shadow, Mos Def - Six Days - Remix.mp3",
    "duration": 233
  },
  {
    "title": "moonlight",
    "artist": "Dhruv",
    "imageUrl": "/extracted-covers/dhruv___moonlight_cover.jpeg",
    "audioUrl": "/songs/Dhruv - moonlight.mp3",
    "duration": 159
  },
  {
    "title": "So High",
    "artist": "Doja Cat",
    "imageUrl": "/extracted-covers/doja_cat___so_high_cover.jpeg",
    "audioUrl": "/songs/Doja Cat - So High.mp3",
    "duration": 202
  },
  {
    "title": "NEW DROP",
    "artist": "Don Toliver",
    "imageUrl": "/extracted-covers/don_toliver___new_drop_cover.jpeg",
    "audioUrl": "/songs/Don Toliver - NEW DROP.mp3",
    "duration": 217
  },
  {
    "title": "Trust Issues",
    "artist": "Drake",
    "imageUrl": "/extracted-covers/drake___trust_issues_cover.jpeg",
    "audioUrl": "/songs/Drake - Trust Issues.mp3",
    "duration": 282
  },
  {
    "title": "Levitating",
    "artist": "Dua Lipa",
    "imageUrl": "/extracted-covers/dua_lipa___levitating_cover.jpeg",
    "audioUrl": "/songs/Dua Lipa - Levitating.mp3",
    "duration": 204
  },
  {
    "title": "Rap God",
    "artist": "Eminem",
    "imageUrl": "/extracted-covers/eminem___rap_god_cover.jpeg",
    "audioUrl": "/songs/Eminem - Rap God.mp3",
    "duration": 369
  },
  {
    "title": "Pink + White",
    "artist": "Frank Ocean",
    "imageUrl": "/extracted-covers/frank_ocean___pink___white_cover.jpeg",
    "audioUrl": "/songs/Frank Ocean - Pink + White.mp3",
    "duration": 185
  },
  {
    "title": "Lady Killers II",
    "artist": "G-Eazy",
    "imageUrl": "/extracted-covers/g_eazy___lady_killers_ii_cover.jpeg",
    "audioUrl": "/songs/G-Eazy - Lady Killers II.mp3",
    "duration": 298
  },
  {
    "title": "Tumblr Girls (feat. Christoph Andersson)",
    "artist": "G-Eazy",
    "imageUrl": "/extracted-covers/G-Eazy - Lady Killers II.jpg",
    "audioUrl": "/songs/G-Eazy, Christoph Andersson - Tumblr Girls (feat. Christoph Andersson).mp3",
    "duration": 256
  },
  {
    "title": "Patola (From \"Blackmail\")",
    "artist": "Guru Randhawa",
    "imageUrl": "/extracted-covers/guru_randhawa__preet_hundal___patola__from__blackmail___cover.jpeg",
    "audioUrl": "/songs/Guru Randhawa, Preet Hundal - Patola (From 'Blackmail').mp3",
    "duration": 184
  },
  {
    "title": "Stereo Hearts (feat. Adam Levine)",
    "artist": "Gym Class Heroes",
    "imageUrl": "/extracted-covers/gym_class_heroes__adam_levine___stereo_hearts__feat__adam_levine__cover.jpeg",
    "audioUrl": "/songs/Gym Class Heroes, Adam Levine - Stereo Hearts (feat. Adam Levine).mp3",
    "duration": 211
  },
  {
    "title": "Shree Hanuman Chalisa",
    "artist": "Hariharan",
    "imageUrl": "/extracted-covers/hariharan___shree_hanuman_chalisa_cover.jpeg",
    "audioUrl": "/songs/Hariharan - Shree Hanuman Chalisa.mp3",
    "duration": 586
  },
  {
    "title": "DONALI",
    "artist": "Harkirat Sangha",
    "imageUrl": "/extracted-covers/harkirat_sangha__starboy_x___donali_cover.jpeg",
    "audioUrl": "/songs/Harkirat Sangha, Starboy X - DONALI.mp3",
    "duration": 172
  },
  {
    "title": "Adore You",
    "artist": "Harry Styles",
    "imageUrl": "/extracted-covers/harry_styles___adore_you_cover.jpeg",
    "audioUrl": "/songs/Harry Styles - Adore You.mp3",
    "duration": 207
  },
  {
    "title": "As It Was",
    "artist": "Harry Styles",
    "imageUrl": "/extracted-covers/harry_styles___as_it_was_cover.jpeg",
    "audioUrl": "/songs/Harry Styles - As It Was.mp3",
    "duration": 167
  },
  {
    "title": "Falling",
    "artist": "Harry Styles",
    "imageUrl": "/extracted-covers/harry_styles___falling_cover.jpeg",
    "audioUrl": "/songs/Harry Styles - Falling.mp3",
    "duration": 240
  },
  {
    "title": "If the World Was Ending (feat. Julia Michaels)",
    "artist": "JP Saxe",
    "imageUrl": "/extracted-covers/jp_saxe__julia_michaels___if_the_world_was_ending__feat__julia_michaels__cover.jpeg",
    "audioUrl": "/songs/JP Saxe, Julia Michaels - If the World Was Ending (feat. Julia Michaels).mp3",
    "duration": 209
  },
  {
    "title": "this is what falling in love feels like",
    "artist": "JVKE",
    "imageUrl": "/extracted-covers/jvke___this_is_what_falling_in_love_feels_like_cover.jpeg",
    "audioUrl": "/songs/JVKE - this is what falling in love feels like.mp3",
    "duration": 120
  },
  {
    "title": "Car's Outside",
    "artist": "James Arthur",
    "imageUrl": "/extracted-covers/james_arthur___car_s_outside_cover.jpeg",
    "audioUrl": "/songs/James Arthur - Car's Outside.mp3",
    "duration": 248
  },
  {
    "title": "comethru",
    "artist": "Jeremy Zucker",
    "imageUrl": "/extracted-covers/jeremy_zucker___comethru_cover.jpeg",
    "audioUrl": "/songs/Jeremy Zucker - comethru.mp3",
    "duration": 182
  },
  {
    "title": "Harleys In Hawaii",
    "artist": "Katy Perry",
    "imageUrl": "/extracted-covers/katy_perry___harleys_in_hawaii_cover.jpeg",
    "audioUrl": "/songs/Katy Perry - Harleys In Hawaii.mp3",
    "duration": 186
  },
  {
    "title": "Hero Handa",
    "artist": "Khushi Baliyan",
    "imageUrl": "/extracted-covers/khushi_baliyan__ashu_twinkle__raj_mawar__punit_choudhary___hero_handa_cover.jpeg",
    "audioUrl": "/songs/Khushi Baliyan, Ashu Twinkle, Raj Mawar, Punit Choudhary - Hero Handa.mp3",
    "duration": 142
  },
  {
    "title": "SPECIALZ",
    "artist": "King Gnu",
    "imageUrl": "/extracted-covers/king_gnu___specialz_cover.jpeg",
    "audioUrl": "/songs/King Gnu - SPECIALZ.mp3",
    "duration": 241
  },
  {
    "title": "Brooklyn Baby",
    "artist": "Lana Del Rey",
    "imageUrl": "/extracted-covers/lana_del_rey___brooklyn_baby_cover.jpeg",
    "audioUrl": "/songs/Lana Del Rey - Brooklyn Baby.mp3",
    "duration": 352
  },
  {
    "title": "Cinnamon Girl",
    "artist": "Lana Del Rey",
    "imageUrl": "/extracted-covers/lana_del_rey___cinnamon_girl_cover.jpeg",
    "audioUrl": "/songs/Lana Del Rey - Cinnamon Girl.mp3",
    "duration": 301
  },
  {
    "title": "Summertime Sadness",
    "artist": "Lana Del Rey",
    "imageUrl": "/extracted-covers/lana_del_rey___summertime_sadness_cover.jpeg",
    "audioUrl": "/songs/Lana Del Rey - Summertime Sadness.mp3",
    "duration": 265
  },
  {
    "title": "White Mustang",
    "artist": "Lana Del Rey",
    "imageUrl": "/extracted-covers/lana_del_rey___white_mustang_cover.jpeg",
    "audioUrl": "/songs/Lana Del Rey - White Mustang.mp3",
    "duration": 165
  },
  {
    "title": "Young And Beautiful",
    "artist": "Lana Del Rey",
    "imageUrl": "/extracted-covers/lana_del_rey___young_and_beautiful_cover.jpeg",
    "audioUrl": "/songs/Lana Del Rey - Young And Beautiful.mp3",
    "duration": 236
  },
  {
    "title": "Summertime Sadness - Sped Up",
    "artist": "Lana Del Rey",
    "imageUrl": "/extracted-covers/lana_del_rey__speed_radio___summertime_sadness___sped_up_cover.jpeg",
    "audioUrl": "/songs/Lana Del Rey, Speed Radio - Summertime Sadness - Sped Up.mp3",
    "duration": 197
  },
  {
    "title": "I Like Me Better",
    "artist": "Lauv",
    "imageUrl": "/extracted-covers/lauv___i_like_me_better_cover.jpeg",
    "audioUrl": "/songs/Lauv - I Like Me Better.mp3",
    "duration": 197
  },
  {
    "title": "Ransom",
    "artist": "Lil Tecca",
    "imageUrl": "/extracted-covers/lil_tecca___ransom_cover.jpeg",
    "audioUrl": "/songs/Lil Tecca - Ransom.mp3",
    "duration": 130
  },
  {
    "title": "Classic",
    "artist": "MKTO",
    "imageUrl": "/extracted-covers/mkto___classic_cover.jpeg",
    "audioUrl": "/songs/MKTO - Classic.mp3",
    "duration": 175
  },
  {
    "title": "Jhol",
    "artist": "Maanu",
    "imageUrl": "/extracted-covers/maanu__annural_khalid___jhol_cover.jpeg",
    "audioUrl": "/songs/Maanu, Annural Khalid - Jhol.mp3",
    "duration": 278
  },
  {
    "title": "Ram ko dekh kar (Live in London)",
    "artist": "Maithili Thakur",
    "imageUrl": "/extracted-covers/maithili_thakur___ram_ko_dekh_kar__live_in_london__cover.jpeg",
    "audioUrl": "/songs/Maithili Thakur - Ram ko dekh kar (Live in London).mp3",
    "duration": 300
  },
  {
    "title": "Obsessed",
    "artist": "Mariah Carey",
    "imageUrl": "/extracted-covers/mariah_carey___obsessed_cover.jpeg",
    "audioUrl": "/songs/Mariah Carey - Obsessed.mp3",
    "duration": 242
  },
  {
    "title": "Nachange Saari Raat (From \"Junooniyat\")",
    "artist": "Meet Bros.",
    "imageUrl": "/extracted-covers/meet_bros___neeraj_shridhar__tulsi_kumar___nachange_saari_raat__from__junooniyat___cover.jpeg",
    "audioUrl": "/songs/Meet Bros., Neeraj Shridhar, Tulsi Kumar - Nachange Saari Raat (From 'Junooniyat').mp3",
    "duration": 252
  },
  {
    "title": "Girl With The Tattoo Enter.lewd",
    "artist": "Miguel",
    "imageUrl": "/extracted-covers/miguel___girl_with_the_tattoo_enter_lewd_cover.jpeg",
    "audioUrl": "/songs/Miguel - Girl With The Tattoo Enter.lewd.mp3",
    "duration": 103
  },
  {
    "title": "Sure Thing - Sped Up",
    "artist": "Miguel",
    "imageUrl": "/extracted-covers/miguel___sure_thing___sped_up_cover.jpeg",
    "audioUrl": "/songs/Miguel - Sure Thing - Sped Up.mp3",
    "duration": 150
  },
  {
    "title": "Angels Like You",
    "artist": "Miley Cyrus",
    "imageUrl": "/extracted-covers/miley_cyrus___angels_like_you_cover.jpeg",
    "audioUrl": "/songs/Miley Cyrus - Angels Like You.mp3",
    "duration": 196
  },
  {
    "title": "My Love Mine All Mine",
    "artist": "Mitski",
    "imageUrl": "/extracted-covers/mitski___my_love_mine_all_mine_cover.jpeg",
    "audioUrl": "/songs/Mitski - My Love Mine All Mine.mp3",
    "duration": 138
  },
  {
    "title": "Matargashti",
    "artist": "Mohit Chauhan",
    "imageUrl": "/extracted-covers/mohit_chauhan___matargashti_cover.jpeg",
    "audioUrl": "/songs/Mohit Chauhan - Matargashti.mp3",
    "duration": 328
  },
  {
    "title": "I WANNA BE YOUR SLAVE",
    "artist": "Måneskin",
    "imageUrl": "/extracted-covers/m_neskin___i_wanna_be_your_slave_cover.jpeg",
    "audioUrl": "/songs/Måneskin - I WANNA BE YOUR SLAVE.mp3",
    "duration": 173
  },
  {
    "title": "The Search",
    "artist": "NF",
    "imageUrl": "/extracted-covers/nf___the_search_cover.jpeg",
    "audioUrl": "/songs/NF - The Search.mp3",
    "duration": 248
  },
  {
    "title": "Bye Bye Bye",
    "artist": "*NSYNC",
    "imageUrl": "/extracted-covers/nsync___bye_bye_bye_cover.jpeg",
    "audioUrl": "/songs/NSYNC - Bye Bye Bye.mp3",
    "duration": 200
  },
  {
    "title": "This Town",
    "artist": "Niall Horan",
    "imageUrl": "/extracted-covers/niall_horan___this_town_cover.jpeg",
    "audioUrl": "/songs/Niall Horan - This Town.mp3",
    "duration": 233
  },
  {
    "title": "Not Around",
    "artist": "Nova",
    "imageUrl": "/extracted-covers/nova___not_around_cover.jpeg",
    "audioUrl": "/songs/Nova - Not Around.mp3",
    "duration": 184
  },
  {
    "title": "Let's Nacho",
    "artist": "Nucleya",
    "imageUrl": "/extracted-covers/nucleya__benny_dayal__badshah___let_s_nacho_cover.jpeg",
    "audioUrl": "/songs/Nucleya, Benny Dayal, Badshah - Let's Nacho.mp3",
    "duration": 215
  },
  {
    "title": "Night Changes",
    "artist": "One Direction",
    "imageUrl": "/extracted-covers/one_direction___night_changes_cover.jpeg",
    "audioUrl": "/songs/One Direction - Night Changes.mp3",
    "duration": 227
  },
  {
    "title": "Perfect",
    "artist": "One Direction",
    "imageUrl": "/extracted-covers/one_direction___perfect_cover.jpeg",
    "audioUrl": "/songs/One Direction - Perfect.mp3",
    "duration": 230
  },
  {
    "title": "PAN INDIA",
    "artist": "Guru Randhawa",
    "imageUrl": "/extracted-covers/pan_india___guru_randhawa_cover.jpeg",
    "audioUrl": "/songs/PAN INDIA - Guru Randhawa.mp3",
    "duration": 131
  },
  {
    "title": "Make You Mine",
    "artist": "PUBLIC",
    "imageUrl": "/extracted-covers/public___make_you_mine_cover.jpeg",
    "audioUrl": "/songs/PUBLIC - Make You Mine.mp3",
    "duration": 233
  },
  {
    "title": "Galti Se Mistake (From \"Jagga Jasoos\")",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh__amit_mishra___galti_se_mistake__from__jagga_jasoos___cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh, Amit Mishra - Galti Se Mistake (From 'Jagga Jasoos').mp3",
    "duration": 203
  },
  {
    "title": "Satyanaas (From \"Chandu Champion\")",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__arijit_singh__nakash_aziz__amitabh_bhattacharya__dev_negi___satyanaas__from__chandu_champion___cover.jpeg",
    "audioUrl": "/songs/Pritam, Arijit Singh, Nakash Aziz, Amitabh Bhattacharya, Dev Negi - Satyanaas (From 'Chandu Champion').mp3",
    "duration": 205
  },
  {
    "title": "Make Some Noise For The Desi Boyz",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__kk__bob___make_some_noise_for_the_desi_boyz_cover.jpeg",
    "audioUrl": "/songs/Pritam, KK, Bob - Make Some Noise For The Desi Boyz.mp3",
    "duration": 244
  },
  {
    "title": "Jhak Maar Ke",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__neeraj_shridhar__harshdeep_kaur___jhak_maar_ke_cover.jpeg",
    "audioUrl": "/songs/Pritam, Neeraj Shridhar, Harshdeep Kaur - Jhak Maar Ke.mp3",
    "duration": 233
  },
  {
    "title": "Ghagra",
    "artist": "Pritam",
    "imageUrl": "/extracted-covers/pritam__rekha_bhardwaj__vishal_dadlani___ghagra_cover.jpeg",
    "audioUrl": "/songs/Pritam, Rekha Bhardwaj, Vishal Dadlani - Ghagra.mp3",
    "duration": 304
  },
  {
    "title": "Sparkle - movie ver.",
    "artist": "RADWIMPS",
    "imageUrl": "/extracted-covers/radwimps___sparkle___movie_ver__cover.jpeg",
    "audioUrl": "/songs/RADWIMPS - Sparkle - movie ver..mp3",
    "duration": 538
  },
  {
    "title": "Suzume",
    "artist": "RADWIMPS",
    "imageUrl": "/extracted-covers/radwimps__toaka___suzume_cover.jpeg",
    "audioUrl": "/songs/RADWIMPS, Toaka - Suzume.mp3",
    "duration": 236
  },
  {
    "title": "Solid Body",
    "artist": "Raju Punjabi",
    "imageUrl": "/extracted-covers/raju_punjabi__sheenam_katholic___solid_body_cover.jpeg",
    "audioUrl": "/songs/Raju Punjabi, Sheenam Katholic - Solid Body.mp3",
    "duration": 177
  },
  {
    "title": "Shri Ram Jaanki Baithe Hai",
    "artist": "Ram Kumar Lakha",
    "imageUrl": "/extracted-covers/ram_kumar_lakha___shri_ram_jaanki_baithe_hai_cover.jpeg",
    "audioUrl": "/songs/Ram Kumar Lakha - Shri Ram Jaanki Baithe Hai.mp3",
    "duration": 516
  },
  {
    "title": "THE SHADE",
    "artist": "Rex Orange County",
    "imageUrl": "/extracted-covers/rex_orange_county___the_shade_cover.jpeg",
    "audioUrl": "/songs/Rex Orange County - THE SHADE.mp3",
    "duration": 182
  },
  {
    "title": "Dandelions",
    "artist": "Ruth B.",
    "imageUrl": "/extracted-covers/ruth_b____dandelions_cover.jpeg",
    "audioUrl": "/songs/Ruth B. - Dandelions.mp3",
    "duration": 234
  },
  {
    "title": "Ram Siya Ram (From \"Adipurush\")",
    "artist": "Sachet-Parampara",
    "imageUrl": "/extracted-covers/sachet_parampara__sachet_tandon__parampara_tandon__manoj_muntashir___ram_siya_ram__from__adipurush___cover.jpeg",
    "audioUrl": "/songs/Sachet-Parampara, Sachet Tandon, Parampara Tandon, Manoj Muntashir - Ram Siya Ram (From 'Adipurush').mp3",
    "duration": 230
  },
  {
    "title": "Dance Basanti",
    "artist": "Sachin-Jigar",
    "imageUrl": "/extracted-covers/sachin_jigar__vishal_dadlani__anushka_manchanda___dance_basanti_cover.jpeg",
    "audioUrl": "/songs/Sachin-Jigar, Vishal Dadlani, Anushka Manchanda - Dance Basanti.mp3",
    "duration": 224
  },
  {
    "title": "Atlantis",
    "artist": "Seafret",
    "imageUrl": "/extracted-covers/seafret___atlantis_cover.jpeg",
    "audioUrl": "/songs/Seafret - Atlantis.mp3",
    "duration": 229
  },
  {
    "title": "One Love",
    "artist": "Shubh",
    "imageUrl": "/extracted-covers/shubh___one_love_cover.jpeg",
    "audioUrl": "/songs/Shubh - One Love.mp3",
    "duration": 159
  },
  {
    "title": "Mind Games",
    "artist": "Sickick",
    "imageUrl": "/extracted-covers/sickick___mind_games_cover.jpeg",
    "audioUrl": "/songs/Sickick - Mind Games.mp3",
    "duration": 258
  },
  {
    "title": "Teenage Dream",
    "artist": "Stephen Dawes",
    "imageUrl": "/extracted-covers/stephen_dawes___teenage_dream_cover.jpeg",
    "audioUrl": "/songs/Stephen Dawes - Teenage Dream.mp3",
    "duration": 178
  },
  {
    "title": "Until I Found You (with Em Beihold) - Em Beihold Version",
    "artist": "Stephen Sanchez",
    "imageUrl": "/extracted-covers/stephen_sanchez__em_beihold___until_i_found_you__with_em_beihold____em_beihold_version_cover.jpeg",
    "audioUrl": "/songs/Stephen Sanchez, Em Beihold - Until I Found You (with Em Beihold) - Em Beihold Version.mp3",
    "duration": 176
  },
  {
    "title": "Dark Red",
    "artist": "Steve Lacy",
    "imageUrl": "/extracted-covers/steve_lacy___dark_red_cover.jpeg",
    "audioUrl": "/songs/Steve Lacy - Dark Red.mp3",
    "duration": 173
  },
  {
    "title": "Good Looking",
    "artist": "Suki Waterhouse",
    "imageUrl": "/extracted-covers/suki_waterhouse___good_looking_cover.jpeg",
    "audioUrl": "/songs/Suki Waterhouse - Good Looking.mp3",
    "duration": 215
  },
  {
    "title": "ily (i love you baby) (feat. Emilee)",
    "artist": "Surf Mesa",
    "imageUrl": "/extracted-covers/surf_mesa__emilee___ily__i_love_you_baby___feat__emilee__cover.jpeg",
    "audioUrl": "/songs/Surf Mesa, Emilee - ily (i love you baby) (feat. Emilee).mp3",
    "duration": 177
  },
  {
    "title": "Lovers Rock",
    "artist": "TV Girl",
    "imageUrl": "/extracted-covers/tv_girl___lovers_rock_cover.jpeg",
    "audioUrl": "/songs/TV Girl - Lovers Rock.mp3",
    "duration": 214
  },
  {
    "title": "Borderline",
    "artist": "Tame Impala",
    "imageUrl": "/extracted-covers/tame_impala___borderline_cover.jpeg",
    "audioUrl": "/songs/Tame Impala - Borderline.mp3",
    "duration": 238
  },
  {
    "title": "Daylight",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___daylight_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - Daylight.mp3",
    "duration": 293
  },
  {
    "title": "Gorgeous",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___gorgeous_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - Gorgeous.mp3",
    "duration": 210
  },
  {
    "title": "Paper Rings",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___paper_rings_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - Paper Rings.mp3",
    "duration": 222
  },
  {
    "title": "The Way I Loved You (Taylor’s Version)",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___the_way_i_loved_you__taylor_s_version__cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - The Way I Loved You (Taylor’s Version).mp3",
    "duration": 243
  },
  {
    "title": "Wildest Dreams",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___wildest_dreams_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - Wildest Dreams.mp3",
    "duration": 220
  },
  {
    "title": "You Belong With Me (Taylor’s Version)",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___you_belong_with_me__taylor_s_version__cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - You Belong With Me (Taylor’s Version).mp3",
    "duration": 231
  },
  {
    "title": "willow",
    "artist": "Taylor Swift",
    "imageUrl": "/extracted-covers/taylor_swift___willow_cover.jpeg",
    "audioUrl": "/songs/Taylor Swift - willow.mp3",
    "duration": 215
  },
  {
    "title": "Daddy Issues",
    "artist": "The Neighbourhood",
    "imageUrl": "/extracted-covers/the_neighbourhood___daddy_issues_cover.jpeg",
    "audioUrl": "/songs/The Neighbourhood - Daddy Issues.mp3",
    "duration": 260
  },
  {
    "title": "Reflections",
    "artist": "The Neighbourhood",
    "imageUrl": "/extracted-covers/the_neighbourhood___reflections_cover.jpeg",
    "audioUrl": "/songs/The Neighbourhood - Reflections.mp3",
    "duration": 244
  },
  {
    "title": "Softcore",
    "artist": "The Neighbourhood",
    "imageUrl": "/extracted-covers/the_neighbourhood___softcore_cover.jpeg",
    "audioUrl": "/songs/The Neighbourhood - Softcore.mp3",
    "duration": 206
  },
  {
    "title": "Sweater Weather",
    "artist": "The Neighbourhood",
    "imageUrl": "/extracted-covers/the_neighbourhood___sweater_weather_cover.jpeg",
    "audioUrl": "/songs/The Neighbourhood - Sweater Weather.mp3",
    "duration": 240
  },
  {
    "title": "You Get Me So High",
    "artist": "The Neighbourhood",
    "imageUrl": "/extracted-covers/The Neighbourhood - Daddy Issues.jpg",
    "audioUrl": "/songs/The Neighbourhood - You Get Me So High.mp3",
    "duration": 153
  },
  {
    "title": "Somebody To You",
    "artist": "The Vamps",
    "imageUrl": "/extracted-covers/the_vamps___somebody_to_you_cover.jpeg",
    "audioUrl": "/songs/The Vamps - Somebody To You.mp3",
    "duration": 185
  },
  {
    "title": "I Love You So",
    "artist": "The Walters",
    "imageUrl": "/extracted-covers/the_walters___i_love_you_so_cover.jpeg",
    "audioUrl": "/songs/The Walters - I Love You So.mp3",
    "duration": 160
  },
  {
    "title": "House Of Balloons / Glass Table Girls",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd___house_of_balloons__glass_table_girls_cover.jpeg",
    "audioUrl": "/songs/The Weeknd - House Of Balloons  Glass Table Girls.mp3",
    "duration": 407
  },
  {
    "title": "Is There Someone Else?",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd___is_there_someone_else_cover.jpeg",
    "audioUrl": "/songs/The Weeknd - Is There Someone Else.mp3",
    "duration": 199
  },
  {
    "title": "Often",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd___often_cover.jpeg",
    "audioUrl": "/songs/The Weeknd - Often.mp3",
    "duration": 249
  },
  {
    "title": "Party Monster",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd___party_monster_cover.jpeg",
    "audioUrl": "/songs/The Weeknd - Party Monster.mp3",
    "duration": 249
  },
  {
    "title": "I Was Never There",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd__gesaffelstein___i_was_never_there_cover.jpeg",
    "audioUrl": "/songs/The Weeknd, Gesaffelstein - I Was Never There.mp3",
    "duration": 241
  },
  {
    "title": "One Of The Girls (with JENNIE, Lily Rose Depp)",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd__jennie__lily_rose_depp___one_of_the_girls__with_jennie__lily_rose_depp__cover.jpeg",
    "audioUrl": "/songs/The Weeknd, JENNIE, Lily-Rose Depp - One Of The Girls (with JENNIE, Lily Rose Depp).mp3",
    "duration": 245
  },
  {
    "title": "Music to Watch Boys To x I Wanna Be Yours",
    "artist": "Treyvik",
    "imageUrl": "/extracted-covers/treyvik___music_to_watch_boys_to_x_i_wanna_be_yours_cover.jpeg",
    "audioUrl": "/songs/Treyvik - Music to Watch Boys To x I Wanna Be Yours.mp3",
    "duration": 142
  },
  {
    "title": "Love Me Back (Fayahh Beat)",
    "artist": "Trinidad Cardona",
    "imageUrl": "/extracted-covers/trinidad_cardona__robinson___love_me_back__fayahh_beat__cover.jpeg",
    "audioUrl": "/songs/Trinidad Cardona, Robinson - Love Me Back (Fayahh Beat).mp3",
    "duration": 194
  },
  {
    "title": "Strawberries & Cigarettes",
    "artist": "Troye Sivan",
    "imageUrl": "/extracted-covers/troye_sivan___strawberries___cigarettes_cover.jpeg",
    "audioUrl": "/songs/Troye Sivan - Strawberries & Cigarettes.mp3",
    "duration": 202
  },
  {
    "title": "YOUTH",
    "artist": "Troye Sivan",
    "imageUrl": "/extracted-covers/troye_sivan___youth_cover.jpeg",
    "audioUrl": "/songs/Troye Sivan - YOUTH.mp3",
    "duration": 185
  },
  {
    "title": "Aankhon Aankhon",
    "artist": "Yo Yo Honey Singh",
    "imageUrl": "/extracted-covers/yo_yo_honey_singh___aankhon_aankhon_cover.jpeg",
    "audioUrl": "/songs/Yo Yo Honey Singh - Aankhon Aankhon.mp3",
    "duration": 245
  },
  {
    "title": "Glassy",
    "artist": "Yo Yo Honey Singh",
    "imageUrl": "/extracted-covers/yo_yo_honey_singh__ashok_mastie__channi_rakhala__bonafide__koncept___glassy_cover.jpeg",
    "audioUrl": "/songs/Yo Yo Honey Singh, Ashok Mastie, Channi Rakhala, Bonafide, Koncept - Glassy.mp3",
    "duration": 222
  },
  {
    "title": "Mind Over Matter (Reprise)",
    "artist": "Young the Giant",
    "imageUrl": "/extracted-covers/young_the_giant___mind_over_matter__reprise__cover.jpeg",
    "audioUrl": "/songs/Young the Giant - Mind Over Matter (Reprise).mp3",
    "duration": 231
  },
  {
    "title": "Bom Diggy Diggy",
    "artist": "Zack Knight",
    "imageUrl": "/extracted-covers/zack_knight__jasmin_walia___bom_diggy_diggy_cover.jpeg",
    "audioUrl": "/songs/Zack Knight, Jasmin Walia - Bom Diggy Diggy.mp3",
    "duration": 239
  },
  {
    "title": "Pano",
    "artist": "Zack Tabudlo",
    "imageUrl": "/extracted-covers/zack_tabudlo___pano_cover.jpeg",
    "audioUrl": "/songs/Zack Tabudlo - Pano.mp3",
    "duration": 254
  },
  {
    "title": "Romantic Homicide",
    "artist": "d4vd",
    "imageUrl": "/extracted-covers/d4vd___romantic_homicide_cover.jpeg",
    "audioUrl": "/songs/d4vd - Romantic Homicide.mp3",
    "duration": 133
  },
  {
    "title": "we fell in love in october",
    "artist": "girl in red",
    "imageUrl": "/extracted-covers/girl_in_red___we_fell_in_love_in_october_cover.jpeg",
    "audioUrl": "/songs/girl in red - we fell in love in october.mp3",
    "duration": 184
  },
  {
    "title": "blue",
    "artist": "yung kai",
    "imageUrl": "/extracted-covers/yung_kai___blue_cover.jpeg",
    "audioUrl": "/songs/yung kai - blue.mp3",
    "duration": 214
  }
];

// Export the songs array directly
export { songs };

const seedSongs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing songs
    await Song.deleteMany({});

    // Insert new songs
    await Song.insertMany(songs);

    console.log("Songs seeded successfully!");
  } catch (error) {
    console.error("Error seeding songs:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Uncomment the next line to run the seed function directly from this file
// seedSongs();
