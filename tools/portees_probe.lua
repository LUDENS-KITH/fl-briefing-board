-- Relevé des portées que DCS donne à ses défenses aériennes (lot 25 du Briefing Board).
-- Le cercle de menace de l'éditeur de mission et de la carte F10 a pour rayon le champ
-- `ThreatRange` de la fiche de l'unité (MissionEditor/modules/me_mission.lua), le cercle de
-- détection `DetectionRange` ; pour les unités de base, ces fiches sont dans la base
-- chiffrée du jeu. Ce script les demande au jeu lui-même, type par type.
--
-- Pose : copier ce fichier dans « Saved Games/DCS/Scripts/Hooks/ », lancer DCS jusqu'au
-- menu principal, quitter, retirer le fichier. Il n'écrit qu'un fichier,
-- « Saved Games/DCS/Logs/fl_portees.tsv » : type, ThreatRange, ThreatRangeMin,
-- DetectionRange (mètres), nom affiché. Il ne touche à aucune mission ni réglage.
-- Ensuite : python tools/build_portees.py <ce fichier .tsv>.
--
-- Liste : les types de défense aérienne relevés dans les missions du poste (30 111
-- fichiers .miz, 2026-11-10) et ceux de la table du lot 21 (mapclass.js). Un type que le
-- jeu ne connaît pas est simplement absent du fichier.

local TYPES = {
  "1L13 EWR", "2S6 Tunguska", "55G6 EWR", "5p73 s-125 ln", "AAA ZU-23 Insurgent", "bofors40",
  "BTR_D", "CH_2S38", "CH_2S38_LG", "CH_3K60_BAL", "CH_9K35", "CH_BukM3_9A317M",
  "CH_BukM3_9A317MA", "CH_BukM3_9S18M13", "CH_BukM3_9S36M", "CH_DF21D", "CH_HQ22_LN",
  "CH_HQ22_SR", "CH_HQ22_STR", "CH_K300P", "CH_LD3000", "CH_LD3000_stationary", "CH_MonolitB",
  "CH_PantsirS2", "CH_PGZ09", "CH_PGZ95", "CH_S350_50N6", "CH_S350_50P6_9M100",
  "CH_S350_50P6_9M96D", "CH_S350_96L6", "CH_SkySabre", "CH_SkySabreGiraffe", "CH_StormerHVM",
  "CH_TorM2K", "CH_YJ12B", "CH_ZSU234", "CHAP_IRISTSLM_LN", "CHAP_IRISTSLM_STR",
  "CHAP_PantsirS1", "CHAP_PGZ09", "CHAP_TorM2", "CHAP_Ural4320_ZU232", "CV_59_H60",
  "CV_59_Large_Forklift", "CV_59_MD3", "CV_59_NS60", "Dog Ear radar", "ERO_Toyota_Tank",
  "ERO_ZPU2_Toyota_armored", "ERO_ZU23_Toyota", "ERO_ZU23_Toyota_armored",
  "EWR 1L119 Nebo-SVU", "EWR 55G6U NEBO-U", "EWR Generic radar tower", "EWR P-37 BAR LOCK",
  "flak18", "FPS-117", "FPS-117 Dome", "GCI_station_MiG29", "Gepard", "GPS_Spoofer_Blue",
  "GPS_Spoofer_Red", "Hawk", "Hawk cwar", "Hawk ln", "Hawk pcp", "Hawk sr", "Hawk tr",
  "HL_ZU-23", "HQ-7_LN_SP", "HQ-7_STR_SP", "HQ17A", "hy_launcher", "Igla manpad INS", "KS-19",
  "Kub 1S91 str", "Kub 2P25 ln", "M1097 Avenger", "M48 Chaparral", "NASAMS_Command_Post",
  "NASAMS_LN_B", "NASAMS_LN_C", "NASAMS_Radar_MPQ64F1", "Osa 9A33 ln", "p-19 s-125 sr",
  "P14_SR", "Patriot AMG", "Patriot cp", "Patriot ECS", "Patriot EPP", "Patriot ln",
  "Patriot str", "PGL_625", "rapier_fsa_blindfire_radar", "rapier_fsa_launcher",
  "rapier_fsa_optical_tracker_unit", "RD_75", "RLS_19J6", "Roland ADS", "RPC_5N62V",
  "S-200_Launcher", "S-300PS 40B6M tr", "S-300PS 40B6MD sr", "S-300PS 40B6MD sr_19J6",
  "S-300PS 54K6 cp", "S-300PS 5H63C 30H6_tr", "S-300PS 5P85C ln", "S-300PS 5P85D ln",
  "S-300PS 64H6E sr", "S-60_Type59_Artillery", "S_70B_Seahawk", "S_75M_Volhov",
  "SA-11 Buk CC 9S470M1", "SA-11 Buk LN 9A310M1", "SA-11 Buk SR 9S18M1", "SA-18 Igla comm",
  "SA-18 Igla manpad", "SA-18 Igla-S comm", "SA-18 Igla-S manpad", "Silkworm_SR",
  "snr s-125 tr", "SNR_75V", "Soldier stinger", "SON_9", "Stinger comm", "Strela-1 9P31",
  "Strela-10M3", "Tor 9A331", "tt_ZU-23", "Type_3_80mm_AA", "Type_88_75mm_AA",
  "Type_94_25mm_AA_Truck", "Type_96_25mm_AA", "Ural-375 ZU-23", "Ural-375 ZU-23 Insurgent",
  "USS_Samuel_Chase", "Vulcan", "ZSU-23-4 Shilka", "ZSU_57_2", "ZU-23 Closed Insurgent",
  "ZU-23 Emplacement", "ZU-23 Emplacement Closed", "ZU-23 Insurgent"
}

local function attr(t, a)
  local ok, v = pcall(DCS.getUnitTypeAttribute, t, a)
  if ok then return v end
end

local function num(v)
  v = tonumber(v)
  if v and v > 0 then return string.format('%.0f', v) end
  return ''
end

local function releve()
  local rows = { 'type\tThreatRange\tThreatRangeMin\tDetectionRange\tDisplayName' }
  for _, t in ipairs(TYPES) do
    local name = attr(t, 'DisplayName')
    if name ~= nil then
      rows[#rows + 1] = table.concat({ t, num(attr(t, 'ThreatRange')), num(attr(t, 'ThreatRangeMin')),
                                       num(attr(t, 'DetectionRange')), tostring(name) }, '\t')
    end
  end
  if #rows < 2 then return false end            -- base pas encore chargée : on réessaiera
  local f = io.open(lfs.writedir() .. 'Logs/fl_portees.tsv', 'w')
  if not f then return false end
  f:write(table.concat(rows, '\n'), '\n'); f:close()
  if log and log.write then log.write('FL_PORTEES', log.INFO, (#rows - 1) .. ' types relevés') end
  return true
end

-- au menu principal (la base des unités est chargée), ou au chargement d'une mission
local done = false
local function essai() if not done then local ok, r = pcall(releve); done = ok and r end end
DCS.setUserCallbacks({ onShowMainInterface = essai, onMissionLoadEnd = essai })
