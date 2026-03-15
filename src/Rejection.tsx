import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XOctagon, Wrench, Scissors, FileEdit, ArrowLeft, Send, CheckCircle, Plus, Trash2, Search } from "lucide-react";
import { fullModelDatabase } from "./modelData"; 
import "./Dashboard.css";

// --- DATA LISTS ---
const assemblyDefectsList = [
  "PVC Crimping", "Crimping Backout", "Terminal Damage Cut Bend", "Cable Length Short", "Cable Length Excess", 
  "Load Fail", "Emety Stork", "Sleeve Length Short", "Sleeve Length Excess", "Nylon Socket Missing", 
  "Nylon Socket Double", "Spring missing", "Spring double", "Heat sealing Burn", "Heat Sealing / Shriking Open", 
  "Rubber Grommet Damage /Flash", "Bulb Holder Damage", "Tinning Missing / Not Ok", "Location Change", 
  "Terminal Backout", "Gasket Missing / Wrong / Damage", "Screen Printing Missing / Spred", 
  "Wire Seal  & Gum Seal Missing Backout / Missing", "Cable Damage", "Connector short Moulding / Damage / Flash", 
  "Taping Open / Not Ok", "Water / Air Leakage", "Lable missing", "\"S\" Stamp Missing", "Same Cable", 
  "Retainer Missing / Open", "Housing Damage / Crack", "Tie Missing /Damage", "Grommet wrong", 
  "Lumbreg connector back out", "Lumbreg connector wire execss/Short", "Lumbreg connector Terminal damage", 
  "Lumbreg connector wrong", "Lumbreg connector Terminal gap execss", "Lumbreg connector half press"
];

const crimpingDefectsList = [
  "Copper strands out", "Low Core / Terminal back out", "High Core / pvc crimping", "Wire seal damage", 
  "CFM Rejection", "Double strok / Empty strok", "applicator setting and cable size setting", "Wrong cable size", 
  "Head Cut, Bend, twest", "PVC Barrel Damage", "Strip length problem", "Less crimping strength", "Copper stand cut", 
  "Excess burr", "Applicater problem / tool problem / Maintenance Set up", "Cable damage", "Harnes rework", 
  "Wrong terminal use", "Wire seal hole Block", "Wire seal cut", "Hst Cross cut", "HST wrong", "Load Fail", 
  "Cable Length Excess", "leakage / Rework", "Sleeve Length Excess", "Heat Sealing / Shriking Open / cable burn", 
  "Rubber Grommet Damage /Flash", "Tinning Missing / Not Ok", "Wire Seal & Gum Seal Missing Backout / Missing", 
  "Lable missing", "Same Cable", "Grommet wrong", "Start Piece", "End Piece"
];

const terminalList = [
  { id: "TR000074", name: "TERMINAL 070 SERIES MALE BRASS TP TYCO 282377-1" },
  { id: "TR000194", name: "TERMINAL CONTACT SERIES BULB CUZN HOOK MCE CODE T007" },
  { id: "TR000808", name: "TERMINAL RING EARTH BRASS HINO" },
  { id: "TR000225", name: "TERMINAL CONTACT SERIES BRASS BOTTON" },
  { id: "TR000258", name: "TERMINAL JOINT SERIES BRASS MID JOINT SMALL" },
  { id: "TR000132", name: "TERMINAL 110 SERIES 2.8 MALE BRASS SIDE FEED PM" },
  { id: "TR000461", name: "TERMINAL 110 SERIES 2.8 FEMALE BRASS AVSS PM TT-1628" },
  { id: "TR000112", name: "TERMINAL 090 SERIES MT095 FEMALE BRASS TP WO / WP" },
  { id: "TR000893", name: "TERMINAL CONTACT SERIES BULB BRASS (INDO)" },
  { id: "TR000894", name: "TERMINAL RING BRASS TP LA 103 (INDO)" },
  { id: "TR000289", name: "TERMINAL BULLET MALE BRASS CA 104" },
  { id: "TR000456", name: "TERMINAL 312 SERIES 8.2 FEMALE BRASS JD031B MT035" },
  { id: "TR000172", name: "TERMINAL 312 SERIES 8.2 FEMALE BRASS FLAG HOOK CO01B312097E-0 MT035 BIG" },
  { id: "TR000256", name: "TERMINAL JOINT SERIES BRASS MID JOINT BIG" },
  { id: "TR000478", name: "TERMINAL 090 SERIES MT095 FEMALE BRASS TP WP WITHOUT LOCK" },
  { id: "TR000237", name: "TERMINAL BULLET FEMALE BRASS TP CB 104" },
  { id: "TR000294", name: "TERMINAL BULLET MALE BRASS TP CA 104 SWS" },
  { id: "TR000250", name: "TERMINAL JOINT SERIES 9 X 5 BRASS" },
  { id: "TR000235", name: "TERMINAL BULLET FEMALE BRASS CB 104" },
  { id: "TR000798", name: "TERMINAL 187 SERIES 4.8 FEMALE BRASS FLAG TYCO 170140-1" },
  { id: "TR000797", name: "TERMINAL BULLET MALE BRASS CA 103 SUMITOMO 1500-0149" },
  { id: "TR000297", name: "TERMINAL BULLET MALE BRASS CA 103 JD 37" },
  { id: "TR000569", name: "TERMINAL CONTACT STRIP 0506-004" },
  { id: "TR000653", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY TP MOLEX 5055721000" },
  { id: "TR000187", name: "TERMINAL PCB SERIES FEMALE PB TP MOLEX 593708000" },
  { id: "TR000836", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP SUMITOMO 8230-4492" },
  { id: "TR000351", name: "TERMINAL MOLEX SERIES FEMALE CORSON ALLOY TP MOLEX 560124-0101" },
  { id: "TR000757", name: "TERMINAL MOLEX SERIES MALE PB TP MOLEX 350211160" },
  { id: "TR000186", name: "TERMINAL PCB SERIES MALE PB TP MOLEX 560868000" },
  { id: "TR000736", name: "TERMINAL JOINT SERIES 7 x 3 BRASS METAFIX 1369-1037" },
  { id: "TR000758", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY GP MOLEX 2053425028" },
  { id: "TR000077", name: "TERMINAL 090 SERIES 2.2 EARTH BRASS" },
  { id: "TR000100", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP WP PM" },
  { id: "TR000199", name: "TERMINAL CONTACT SERIES BULB PB TP HOOK METAFIX W105 TL" },
  { id: "TR000159", name: "TERMINAL 187 SERIES 4.8 FEMALE BRASS TP SLOTTED JD 012T" },
  { id: "TR000531", name: "TERMINAL 110 SERIES 2.8 FEMALE BRASS TP MINDA SAI 4300115308" },
  { id: "TR000532", name: "TERMINAL BULLET MALE BRASS TP CA 103 MINDA SAI 4301362302" },
  { id: "TR000278", name: "TERMINAL RING BRASS TP LA 103" },
  { id: "TR000474", name: "TERMINAL 187 SERIES 4.8 FEMALE BRASS DIMPLE PM" },
  { id: "TR000388", name: "TERMINAL 110 SERIES 2.8 MALE BRASS AVSS PLASTOMETAL" },
  { id: "TR000059", name: "TERMINAL 060 SERIES FEMALE PB TP WP TYCO 282403-1" },
  { id: "TR000068", name: "TERMINAL 070 SERIES FEMALE BRASS TP TYCO 173631-6" },
  { id: "TR000127", name: "TERMINAL 110 SERIES 2.8 FEMALE BRASS TP DIMPLE INARCA 0011397101" },
  { id: "TR000062", name: "TERMINAL 060 SERIES MALE BRASS TP WP TYCO 282404-1" },
  { id: "TR000071", name: "TERMINAL 070 SERIES MALE BRASS TP TYCO 345210-1" },
  { id: "TR000304", name: "TERMINAL MOLEX SERIES MALE BRASS TP 2092101" },
  { id: "TR000326", name: "TERMINAL PCB SERIES MALE BRASS TP 5394" },
  { id: "TR000226", name: "TERMINAL CONTACT SERIES PB TP HOOK CONTACT STRIP" },
  { id: "TR000559", name: "TERMINAL MOLEX SERIES MALE PB TP MOLEX 500978000 1257B-002MA0Y" },
  { id: "TR000524", name: "TERMINAL 090 SERIES MT095 FEMALE BRASS TP WP SUMITOMO 1500-0110" },
  { id: "TR000091", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP WP 2929TC" },
  { id: "TR000941", name: "TERMINAL 110 SERIES 2.8 FEMALE BRASS TT-1828" },
  { id: "TR000138", name: "TERMINAL 110 SERIES 2.8 MALE BRASS" },
  { id: "TR000145", name: "TERMINAL BULLET FEMALE BRASS TP JD AUTO JD 156 L TYPE" },
  { id: "TR000267", name: "TERMINAL RING BRASS LA 104" },
  { id: "TR000010", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS HOOK" },
  { id: "TR000106", name: "TERMINAL 090 SERIES MT095 FEMALE BRASS TP WITH LOCK 864TC" },
  { id: "TR000279", name: "TERMINAL RING BRASS TP LA 104" },
  { id: "TR000285", name: "TERMINAL RING BRASS TP LA 306" },
  { id: "TR000173", name: "TERMINAL 312 SERIES 8.2 FEMALE BRASS HOOK" },
  { id: "TR000043", name: "TERMINAL 250 SERIES 6.3 MALE BRASS TP VINAY" },
  { id: "TR000044", name: "TERMINAL 250 SERIES 6.3 MALE BRASS TP WINDOW SWS 0.5 SQ MM" },
  { id: "TR000018", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS TP 0.5 SQ MM" },
  { id: "TR000019", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS TP HOOK" },
  { id: "TR000042", name: "TERMINAL 250 SERIES 6.3 MALE BRASS TP HOOK 1.0 SQ MM" },
  { id: "TR000024", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS TP WINDOW 0.5 SQ MM" },
  { id: "TR000156", name: "TERMINAL 187 SERIES 4.8 FEMALE BRASS TP DIMPLE" },
  { id: "TR000295", name: "TERMINAL BULLET MALE BRASS TP CA 104 VINAY" },
  { id: "TR000270", name: "TERMINAL RING BRASS LA 106" },
  { id: "TR000280", name: "TERMINAL RING BRASS TP LA 105 THK 0.6" },
  { id: "TR000030", name: "TERMINAL 250 SERIES 6.3 FEMALE PB DIMPLE" },
  { id: "TR000469", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS PLAIN SWS/MODVAK 2497 P / ME145P-OC 4.0 SQ MM" },
  { id: "TR000257", name: "TERMINAL JOINT SERIES BRASS MID JOINT EXTRA BIG" },
  { id: "TR000265", name: "TERMINAL RING BRASS LA 106 THK 0.8" },
  { id: "TR000046", name: "TERMINAL 250 SERIES 6.3 MALE BRASS WINDOW SWS 0.5 SQ MM" },
  { id: "TR000047", name: "TERMINAL 250 SERIES 6.3 MALE BRASS WINDOW 2506 4.0 SQ MM" },
  { id: "TR000300", name: "TERMINAL MOLEX SERIES FEMALE PB TP 5556 039000038" },
  { id: "TR000134", name: "TERMINAL 110 SERIES 2.8 MALE BRASS TP" },
  { id: "TR000277", name: "TERMINAL RING BRASS TP LA 106 THK 0.8" },
  { id: "TR000038", name: "TERMINAL 250 SERIES 6.3 MALE BRASS HOOK 2.5 SQ MM" },
  { id: "TR000182", name: "TERMINAL 312 SERIES 8.2 MALE BRASS WINDOW TT-1716" },
  { id: "TR000136", name: "TERMINAL 110 SERIES 2.8 MALE BRASS TP SIDE FEED PM" },
  { id: "TR000176", name: "TERMINAL 312 SERIES 8.2 FEMALE BRASS TP HOOK" },
  { id: "TR000179", name: "TERMINAL 312 SERIES 8.2 MALE BRASS TP WINDOW TT-1716TC" },
  { id: "TR000332", name: "TERMINAL BULLET MALE BRASS TP CA 103" },
  { id: "TR000276", name: "TERMINAL RING BRASS TP LA 108 ID 8.4 OD 15" },
  { id: "TR000006", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS PLAIN 0.5 SQ MM" },
  { id: "TR000190", name: "TERMINAL BULLET FEMALE BRASS CB 103" },
  { id: "TR000263", name: "TERMINAL RING BRASS LA 106 TT-1746 THK 0.6" },
  { id: "TR000073", name: "TERMINAL 070 SERIES MALE BRASS TP TYCO 171661-1" },
  { id: "TR000334", name: "TERMINAL CONTACT SERIES EARTH BRASS FOR K70 MAGNETO" },
  { id: "TR000339", name: "TERMINAL CARBON BRUSH +VE" },
  { id: "TR000732", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY TP MOLEX 5054311000" },
  { id: "TR000520", name: "TERMINAL HD SERIES FEMALE BRASS TP SUMITOMO 8242-4068" },
  { id: "TR000066", name: "TERMINAL 070 SERIES FEMALE BRASS TP TYCO 173631-1" },
  { id: "TR000564", name: "TERMINAL 250 SERIES 6.3 MALE CU TP TYCO 1544218-1" },
  { id: "TR000067", name: "TERMINAL 250 SERIES 6.3 FEMALE CU TP TYCO 1544133-1" },
  { id: "TR000144", name: "TERMINAL 312 SERIES 8.2 FEMALE BRASS PLAIN TT-1727 1.0 TO 2.5 SQ MM" },
  { id: "TR000251", name: "TERMINAL BULLET FEMALE BRASS TP CB 104 TT-1917B L TYPE" },
  { id: "TR000045", name: "TERMINAL 250 SERIES 6.3 MALE BRASS TP WINDOW 4.0 SQ MM" },
  { id: "TR000017", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS TP FLAG PLAIN METAFIX" },
  { id: "TR000317", name: "TERMINAL ROUND SERIES FEMALE BRASS TP TYCO 929974-1" },
  { id: "TR000064", name: "TERMINAL 060 SERIES MALE PB TP WP TYCO 282109-1" },
  { id: "TR000129", name: "TERMINAL 110 SERIES 2.8 FEMALE CUNISI TP FLAT TYCO 1-968849-1" },
  { id: "TR000821", name: "TERMINAL MALE FOR SENSOR" },
  { id: "TR000057", name: "TERMINAL 060 SERIES FEMALE BRASS TP TYCO 0-0282110-1" },
  { id: "TR000130", name: "TERMINAL 110 SERIES 2.8 FEMALE CUNISI TP FLAT TYCO 1-968851-1 1.25 TO 2.5 SQ MM" },
  { id: "TR000249", name: "TERMINAL JOINT SERIES 17 X 5 BRASS" },
  { id: "TR000264", name: "TERMINAL RING BRASS LA 108 ME-088" },
  { id: "TR000312", name: "TERMINAL MQS SERIES CUSN TP TYCO 927771-1" },
  { id: "TR000315", name: "TERMINAL MQS SERIES 132313-1" },
  { id: "TR000336", name: "TERMINAL FUSE BRASS TP TT-1868 1.5 SQ MM" },
  { id: "TR000337", name: "TERMINAL FUSE CUZN30 TP TT-1853 2.5 SQ MM" },
  { id: "TR000254", name: "TERMINAL JOINT SERIES BRASS EXTRA BIG TT-1518" },
  { id: "TR000076", name: "TERMINAL 070 SERIES MALE PB TP TYCO 173645-1 PN 2196060-1" },
  { id: "TR000102", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP YAZAKI 7114-4021" },
  { id: "TR000113", name: "TERMINAL 090 SERIES MT095 FEMALE BRASS TP YAZAKI 7116-4021" },
  { id: "TR000092", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP WP SUMITOMO 8100-0458" },
  { id: "TR000168", name: "TERMINAL 187 SERIES MT091 MALE BRASS TP WP SUMITOMO 8100-0464" },
  { id: "TR000109", name: "TERMINAL 090 SERIES MT095 FEMALE COPPER ALLOY TP SUMITOMO 8100-0461" },
  { id: "TR000105", name: "TERMINAL 090 SERIES MT095 FEMALE COPPER ALLOY GP SUMITOMO 8100-1344" },
  { id: "TR000245", name: "TERMINAL JOINT SERIES 13 X 5 BRASS" },
  { id: "TR000287", name: "TERMINAL RING BRASS LA 308" },
  { id: "TR000233", name: "TERMINAL DT SERIES FEMALE BRASS TP 1062-16-1222" },
  { id: "TR000822", name: "TERMINAL FEMALE FOR SENSOR" },
  { id: "TR000536", name: "TERMINAL 070 SERIES FEMALE BRASS TP WP TYCO 171662-1" },
  { id: "TR000420", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY TP MOLEX 33012-3002" },
  { id: "TR000389", name: "TERMINAL 060 SERIES MALE CUSN4 TP TYCO 963904-1" },
  { id: "TR000110", name: "TERMINAL DT SERIES FEMALE COPPER ALLOY GP DEUTSCH 1062-16-0644" },
  { id: "TR000012", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS HOOK TT-1013 2.0 TO 3.0 SQ MM" },
  { id: "TR000311", name: "TERMINAL 110 SERIES MALE CuSn4 TYCO 1-962841-1" },
  { id: "TR000792", name: "TERMINAL 110 SERIES 2.8 MALE CUSN4 TP TYCO 1-962842-1" },
  { id: "TR000325", name: "TERMINAL PCB SERIES FEMALE BRASS TP KET ST730910-3D" },
  { id: "TR000121", name: "TERMINAL 110 SERIES 2.8 FEMALE BRASS DIMPLE TT-1698" },
  { id: "TR000320", name: "TERMINAL PCB SERIES FEMALE PB TP 25081TS" },
  { id: "TR000143", name: "TERMINAL CONTACT SERIES MAIN PB METAFIX 1369-1047" },
  { id: "TR000213", name: "TERMINAL CONTACT SERIES BULB PB TP HOOK METAFIX VARROC LD" },
  { id: "TR000216", name: "TERMINAL CONTACT SERIES EARTH PB WP HOOK METAFIX 1" },
  { id: "TR000208", name: "TERMINAL CONTACT SERIES BULB BRASS TP JD055T" },
  { id: "TR000212", name: "TERMINAL CONTACT SERIES BULB PB HOOK JD182P" },
  { id: "TR000314", name: "TERMINAL MQS SERIES FEMALE BRASS TP TYCO 5-928999-1 SKODA HL" },
  { id: "TR000029", name: "TERMINAL 250 SERIES 6.3 FEMALE CUSN TP FLAG TYCO 1544113-4" },
  { id: "TR000150", name: "TERMINAL 150 SERIES MALE BRASS TP WP DELPHI 15326269" },
  { id: "TR000214", name: "TERMINAL CONTACT SERIES BULB BRASS FOR 7522-028C" },
  { id: "TR000060", name: "TERMINAL 060 SERIES MALE BRASS TP MOLEX 330001002" },
  { id: "TR000507", name: "TERMINAL 060 SERIES MALE BRASS TP MOLEX 0330001004" },
  { id: "TR000055", name: "TERMINAL 050 SERIES MALE COPPER ALLOY TP KET 740709-3" },
  { id: "TR000007", name: "TERMINAL CONTACT SERIES BULB PB TP HOOK JD 182T" },
  { id: "TR000035", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS WINDOW FLAG METAFIX" },
  { id: "TR000085", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP CN 100" },
  { id: "TR000063", name: "TERMINAL 060 SERIES MALE COPPER ALLOY TP 6821108KSS" },
  { id: "TR000193", name: "TERMINAL CONTACT SERIES BULB CUSN TP 2M5T-14474-DB" },
  { id: "TR000084", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP BIG" },
  { id: "TR000218", name: "TERMINAL CONTACT SERIES EARTH PB WP HOOK METAFIX 2" },
  { id: "TR000140", name: "TERMINAL 110 SERIES 2.8 MALE CUFE TP TYCO 2-964294-1" },
  { id: "TR000706", name: "TERMINAL PCB SERIES FEMALE COPPER ALLOY TP SWB 2019THY2PH02Q 0.35 TO 0.5 SQ MM" },
  { id: "TR000884", name: "TERMINAL 50 SERIES MALE COPPER ALLOY TP MOLEX 5056080000" },
  { id: "TR000856", name: "TERMINAL MICRO POWER SERIES FEMALE CUNISI TP TYCO 968075-2" },
  { id: "TR000883", name: "TERMINAL 110 SERIES FEMALE CUSN4 TYCO 964282-2" },
  { id: "TR000833", name: "TERMINAL PCB SERIES FEMALE CUNISI TP KOSTAL 10516365" },
  { id: "TR000885", name: "TERMINAL 60 SERIES MALE CUSN TP APTIV 33501792" },
  { id: "TR000886", name: "TERMINAL 110 SERIES MALE CUSN TP APTIV 10756743" },
  { id: "TR000857", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY TP MOLEX 33012-3004" },
  { id: "TR000855", name: "TERMINAL 110 SERIES 2.8 MALE CUFE TP TYCO 2-964292-1" },
  { id: "TR000141", name: "TERMINAL 110 SERIES 2.8 MALE CUFE TP TYCO 2-964296-1 1.25 TO 2.5 SQ MM" },
  { id: "TR000707", name: "TERMINAL PCB SERIES FEMALE COPPER ALLOY TP UJU KH1710007-22 0.3 TO 0.5 SQ MM" },
  { id: "TR000892", name: "TERMINAL 50 SERIES FEMALE COPPER ALLOY TP MOLEX 5056070000" },
  { id: "TR000521", name: "TERMINAL MOLEX SERIES FEMALE BRASS TP MOLEX 35021-1001" },
  { id: "TR000151", name: "TERMINAL 150 SERIES MALE COPPER ALLOY TP DELPHI 15326268" },
  { id: "TR000318", name: "TERMINAL 048 SERIES FEMALE BRASS TP YAZAKI 7116-1261 0.5 TO 1.25 SQ MM" },
  { id: "TR000740", name: "TERMINAL PCB SERIES FEMALE COPPER NICKEL ALLOY TP AMPHENOL 10155447-111MLF" },
  { id: "TR000232", name: "TERMINAL CONTACT SERIES BULB BRASS TP 8800K01" },
  { id: "TR000142", name: "TERMINAL 110 SERIES 2.8 MALE CUSN TP 10725097" },
  { id: "TR000222", name: "TERMINAL CONTACT SERIES EARTH PB TP TRW 2982133799" },
  { id: "TR000128", name: "TERMINAL 110 SERIES 2.8 FEMALE BRASS TP HOOK STOCKO RSB 5280.1058" },
  { id: "TR000088", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP SUMITOMO 8230-4502" },
  { id: "TR000117", name: "TERMINAL 090 SERIES MT095 FEMALE CUNISI TP TYCO 368085-1" },
  { id: "TR000116", name: "TERMINAL 090 SERIES MT095 FEMALE CUNISI TP TYCO 368084-1" },
  { id: "TR000215", name: "TERMINAL CONTACT SERIES EARTH PB WP HOOK MOLEX 354658000" },
  { id: "TR000227", name: "TERMINAL CONTACT SERIES MAIN PB MOLEX 354648000" },
  { id: "TR000324", name: "TERMINAL PCB SERIES FEMALE PB TP JST SPHD-001T-P0.5" },
  { id: "TR000031", name: "TERMINAL 250 SERIES 6.3 FEMALE PB FLAG IE 1304 478 035" },
  { id: "TR000149", name: "TERMINAL 150 SERIES FEMALE BRASS TP DELPHI 15496531" },
  { id: "TR000759", name: "TERMINAL 150 SERIES FEMALE BRASS TP WP DELPHI 12191818" },
  { id: "TR000506", name: "TERMINAL PCB SERIES FEMALE CUSN4 TP TYCO 7-1452659-1" },
  { id: "TR000333", name: "TERMINAL 090 SERIES FEMALE BRASS TP YAZAKI 7116-4020" },
  { id: "TR000768", name: "TERMINAL 060 SERIES MALE COPPER ALLOY TP WP YAZAKI 7114-4102-02" },
  { id: "TR000115", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP SUMITOMO 8230-4272" },
  { id: "TR000224", name: "TERMINAL CONTACT SERIES EARTH SS301 WY21W F214SP0204" },
  { id: "TR000230", name: "TERMINAL CONTACT SERIES MAIN SS301 WY21W F214SP0203" },
  { id: "TR000228", name: "TERMINAL 060 SERIES MALE BRASS TP SUMITOMO 82305307" },
  { id: "TR000575", name: "TERMINAL MOLEX SERIES FEMALE CUSN MOLEX 33468-0023" },
  { id: "TR000572", name: "TERMINAL 090 SERIES MALE BRASS TP YAZAKI 7114-4025" },
  { id: "TR000573", name: "TERMINAL 090 SERIES MALE BRASS TP YAZAKI 7114-4026" },
  { id: "TR000574", name: "TERMINAL 187 SERIES FEMALE DELPHI/APTIV 15509075" },
  { id: "TR000560", name: "TERMINAL 090 SERIES MT095 FEMALE BRASS TP 8240-4882" },
  { id: "TR000341", name: "TERMINAL 090 SERIES MALE JD-463T" },
  { id: "TR000889", name: "TERMINAL 110 SERIES 2.8 FEMALE CUFE2 TP TYCO 964273-1" },
  { id: "TR000708", name: "TERMINAL MOLEX SERIES FEMALE PB TP MOLEX 430300001" },
  { id: "TR000296", name: "TERMINAL PCB SERIES MALE PB TP MOLEX 430310001" },
  { id: "TR000803", name: "TERMINAL 060 SERIES FEMALE COPPER ALLOY TP WP YAZAKI 7116-4102-02" },
  { id: "TR000790", name: "TERMINAL MOLEX SERIES FEMALE PB TP MOLEX 0430300038" },
  { id: "TR000826", name: "TERMINAL MOLEX SERIES MALE PB TP MOLEX 430310021" },
  { id: "TR001003", name: "TERMINAL PCB SERIES FEMALE COPPER ALLOY TP UJU KH1600036-21" },
  { id: "TR000188", name: "TERMINAL 090 SERIES MALE BRASS TP YAZAKI 7114-4020" },
  { id: "TR000191", name: "TERMINAL CONTACT SERIES PB TP JD 169PT BRACK SWITCH" },
  { id: "TR000543", name: "TERMINAL BULLET MALE BRASS TP CA 103 JD121AT SMALL" },
  { id: "TR000021", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS TP LOCK JD 022AT" },
  { id: "TR000023", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS TP PLAIN JD 023AT" },
  { id: "TR000133", name: "TERMINAL 110 SERIES 2.8 MALE BRASS TP FL-103 JD 009T" },
  { id: "TR000155", name: "TERMINAL 187 SERIES 4.8 FEMALE BRASS TP BOX JD 124T" },
  { id: "TR000240", name: "TERMINAL BULLET FEMALE BRASS TP CW 103 JD 039AT" },
  { id: "TR000291", name: "TERMINAL BULLET MALE BRASS TP CA 103 JD 037T" },
  { id: "TR000252", name: "TERMINAL JOINT SERIES 9 X 5 BRASS TP JD 075T" },
  { id: "TR000731", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY TP MOLEX 5025790000" },
  { id: "TR000327", name: "TERMINAL PCB SERIES MALE BRASS TP SIN" },
  { id: "TR000126", name: "TERMINAL 110 SERIES 2.8 FEMALE BRASS TP BOTTOM DIMPLE" },
  { id: "TR000097", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP SUMITOMO 8100-3803" },
  { id: "TR000120", name: "TERMINAL 110 SERIES 2.8 FEMALE BRASS BOTTAM DIMPLE" },
  { id: "TR000111", name: "TERMINAL 090 SERIES MT095 FEMALE COPPER ALLOY TP SUMITOMO 1500-0110" },
  { id: "TR000755", name: "TERMINAL CONTACT SERIES BULB BRASS TP 7009-002" },
  { id: "TR000201", name: "TERMINAL CONTACT SERIES BULB PB 6529-002T SEDAN" },
  { id: "TR000005", name: "TERMINAL 025 SERIES FEMALE CUNISI TP TYCO 963716-1" },
  { id: "TR000200", name: "TERMINAL CONTACT SERIES BULB PB TP HOOK 7611" },
  { id: "TR000211", name: "TERMINAL CONTACT SERIES BULB PB TP TRW 2870653799" },
  { id: "TR000167", name: "TERMINAL 187 SERIES 4.8 MALE BRASS BIG HOLE" },
  { id: "TR000234", name: "TERMINAL CONTACT SERIES EARTH CRCA TP 02 2610411001 0" },
  { id: "TR000026", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS WINDOW DIMPLE 0.85 TO 1.25 SQ MM" },
  { id: "TR000069", name: "TERMINAL 070 SERIES FEMALE BRASS TP TYCO 1-1437713" },
  { id: "TR000261", name: "TERMINAL RING BRASS LA 103 5024A" },
  { id: "TR000206", name: "TERMINAL 187 SERIES 4.8 FEMALE BRASS TP APTIV 35298797" },
  { id: "TR000202", name: "TERMINAL 250 SERIES FEMALE COPPER ALLOY TP APTIV 35298798" },
  { id: "TR000050", name: "TERMINAL 250 SERIES 6.3 MALE PB HOOK X-1 HBK" },
  { id: "TR000001", name: "TERMINAL 020 SERIES FEMALE COPPER ALLOY TP UJU KH1200030-21" },
  { id: "TR000323", name: "TERMINAL PCB SERIES FEMALE PB TP JST SPA-001T-P0 5" },
  { id: "TR000523", name: "TERMINAL CONTACT SERIES BULB PB TP METAFIX FOR U321" },
  { id: "TR000209", name: "TERMINAL CONTACT SERIES BULB BRASS TP MOLEX 35477-9002" },
  { id: "TR000730", name: "TERMINAL 090 SERIES MALE BRASS TP JD AUTO JD-206CT" },
  { id: "TR000756", name: "TERMINAL 060 SERIES MALE BRASS TP YAZAKI 7114-1301" },
  { id: "TR000544", name: "TERMINAL CONTACT SERIES EARTH PB JD 97P W 3.86" },
  { id: "TR000298", name: "TERMINAL MOLEX SERIES FEMALE PB TP MOLEX 503728000" },
  { id: "TR000805", name: "TERMINAL ROUND SERIES MALE COPPER ALLOY TP TYCO 1703014-1" },
  { id: "TR000037", name: "TERMINAL 150 SERIES FEMALE DELPHI 12191818" },
  { id: "TR000788", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP SUMITOMO 8100-3803 H7 TL" },
  { id: "TR000733", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY TP MOLEX 5024380000" },
  { id: "TR000737", name: "TERMINAL MOLEX SERIES FEMALE PB TP MOLEX 5600850101" },
  { id: "TR000514", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP WP SUMITOMO 1500-0105" },
  { id: "TR000299", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY TP MOLEX 505153-8000" },
  { id: "TR000098", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP TYCO 936261-1" },
  { id: "TR000316", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP SUMITOMO 8100-1571" },
  { id: "TR000869", name: "TERMINAL 090 SERIES FEMALE BRASS TP SUMITOMO 8100-1470" },
  { id: "TR000939", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY TP MOLEX 5600230748" },
  { id: "TR000148", name: "TERMINAL 110 SERIES FEMALE COPPER ALLOY TP KET ST730524-3" },
  { id: "TR000053", name: "TERMINAL 040 SERIES FEMALE COPPER ALLOY TP KET ST730960-3" },
  { id: "TR000089", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP JD 004T" },
  { id: "TR000072", name: "TERMINAL 070 SERIES MALE BRASS TP TYCO 171631-1" },
  { id: "TR000119", name: "TERMINAL 110 SERIES 2.8 FEMALE BRASS VINAY" },
  { id: "TR000056", name: "TERMINAL 050 SERIES MALE COPPER ALLOY TP KET 740709-3" },
  { id: "TR000123", name: "TERMINAL HORN PB 1055D-028-002A0Y L TYPE" },
  { id: "TR000070", name: "TERMINAL 090 SERIES MT095 FEMALE COPPER ALLOY TP WP 1500-0110-02" },
  { id: "TR000096", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP SUMITOMO 1500-0105 N109" },
  { id: "TR000811", name: "TERMINAL PCB SERIES MALE BRASS TP JST SJN-001PT-0.9" },
  { id: "TR000830", name: "TERMINAL 060 SERIES MALE COPPER ALLOY TP YAZAKI 7114-4416-02" },
  { id: "TR000195", name: "TERMINAL CONTACT SERIES BULB CUZN SAFARI" },
  { id: "TR000174", name: "TERMINAL 020 SERIES FEMALE COPPER ALLOY TP UJU KH1400004-21" },
  { id: "TR000198", name: "TERMINAL 020 SERIES FEMALE COPPER ALLOY TP UJU KH1200030-21 MINDA LD" },
  { id: "TR000180", name: "TERMINAL 090 SERIES MALE BRASS TP MSSL 8100-0457" },
  { id: "TR000197", name: "TERMINAL 090 SERIES FEMALE SUMITOMO 8240-0140" },
  { id: "TR000571", name: "TERMINAL 090 SERIES MALE BRASS TP MSSL 81000458" },
  { id: "TR000321", name: "TERMINAL PCB SERIES FEMALE PB TP JST RMC 2 MM PITCH" },
  { id: "TR000272", name: "TERMINAL RING BRASS TP LA 204 SUN VIN" },
  { id: "TR000015", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS TP FLAG TT-1911" },
  { id: "TR000509", name: "TERMINAL 250 SERIES 6.3 MALE BRASS TP DELPHI 02971962" },
  { id: "TR000165", name: "TERMINAL 187 SERIES 4.8 FEMALE BRASS TP WINDOW DIMPLE 0.6 GAP" },
  { id: "TR000079", name: "TERMINAL 090 SERIES FEMALE BRASS TP KET 730461" },
  { id: "TR000054", name: "TERMINAL 050 SERIES FEMALE CC101R-H KUM MT095-29880" },
  { id: "TR000519", name: "TERMINAL 312 SERIES 8.2 MALE BRASS TT-1509" },
  { id: "TR000275", name: "TERMINAL RING BRASS TP LA 106 STAR TYPE TT-2890TC" },
  { id: "TR000118", name: "TERMINAL 090 SERIES MT095 FEMALE PB TP TOYOTO" },
  { id: "TR000260", name: "TERMINAL RING BRASS LA 306 971OC" },
  { id: "TR000022", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS TP PLAIN 4.0 SQ MM" },
  { id: "TR000178", name: "TERMINAL 312 SERIES 8.2 MALE BRASS TP WINDOW 4.0 SQ MM" },
  { id: "TR000248", name: "TERMINAL JOINT SERIES 17 X 5 BRASS TP" },
  { id: "TR000259", name: "TERMINAL JOINT SERIES BRASS TP MID JOINT SMALL" },
  { id: "TR000463", name: "TERMINAL 110 SERIES 2.8 FEMALE BRASS TP 0.5 TO 0.75 SQ MM" },
  { id: "TR000114", name: "TERMINAL 090 SERIES MT095 FEMALE COPPER ALLOY TP KET ST730675-3" },
  { id: "TR000058", name: "TERMINAL 060 SERIES FEMALE BRASS TP TYCO 282466-1" },
  { id: "TR000107", name: "TERMINAL 090 SERIES MT095 FEMALE BRASS TP KET 730460-3" },
  { id: "TR000108", name: "TERMINAL 090 SERIES MT095 FEMALE COPPER ALLOY TP KET 730461-3" },
  { id: "TR000338", name: "TERMINAL FUSE BRASS TP TT-1920" },
  { id: "TR000103", name: "TERMINAL 090 SERIES MT095 MALE BRASS TP HULANE 6617217BSS" },
  { id: "TR000175", name: "TERMINAL 312 SERIES 8.2 FEMALE BRASS PLAIN TT-1927" },
  { id: "TR000004", name: "TERMINAL 025 SERIES FEMALE COPPER ALLOY TP KET ST731053-3" },
  { id: "TR000094", name: "TERMINAL 090 SERIES MT091 MALE BRASS TP KET ST740672-3" },
  { id: "TR000003", name: "TERMINAL 025 SERIES FEMALE COPPER ALLOY TP KM025B F TML(L)" },
  { id: "TR000508", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS HULANE 6616401BS0" },
  { id: "TR000480", name: "TERMINAL JOINT SERIES 19 X 5 BRASS TT TT-1519" },
  { id: "TR000510", name: "TERMINAL 250 SERIES 6.3 MALE BRASS TP SUMITOMO 8230-4042" },
  { id: "TR000512", name: "TERMINAL 312 SERIES 8.2 MALE BRASS TP SUMITOMO 8232-4282" },
  { id: "TR000594", name: "TERMINAL FUSE FEMALE BRASS TP TT 1603" },
  { id: "TR000479", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS TT TT-1704 P-LOCK" },
  { id: "TR000158", name: "TERMINAL COPPER TUBE ELH-50" },
  { id: "TR000153", name: "TERMINAL 187 SERIES 4.8 FEMALE BRASS HOOK TT-1864" },
  { id: "TR000061", name: "TERMINAL 060 SERIES MALE BRASS TP WP TYCO 282465" },
  { id: "TR000099", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY TP MOLEX 34805-0111" },
  { id: "TR000104", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY TP MOLEX 34803-3212" },
  { id: "TR000181", name: "TERMINAL 312 SERIES 8.2 MALE BRASS WINDOW 895OC 4.0 SQ MM" },
  { id: "TR000065", name: "TERMINAL 060 SERIES MALE PB TP WP TT-1737TC" },
  { id: "TR000634", name: "TERMINAL 187 SERIES BRASS TP HULANE 6618811BSS 2.0 TO 3.0 MM" },
  { id: "TR000635", name: "TERMINAL 187 SERIES BRASS TP HULANE 6618812BSS 0.85 TO 1.25 SQ MM" },
  { id: "TR000562", name: "TERMINAL M 8 ER-121 10.0 SQ MM" },
  { id: "TR000152", name: "TERMINAL COPPER TUBE ELH-35" },
  { id: "TR000561", name: "TERMINAL M 5 ER-026 10.0 SQ MM" },
  { id: "TR000095", name: "TERMINAL M 6 ER-129 25.0 SQ MM" },
  { id: "TR000567", name: "TERMINAL M 6 ER-029 16.0 SQ MM" },
  { id: "TR000577", name: "TERMINAL COPPER TUBE ELH-95" },
  { id: "TR000352", name: "TERMINAL ROUND SERIES FEMALE COPPER ALLOY GP TYCO 770520-3" },
  { id: "TR001025", name: "TERMINAL PCB SERIES CUSN4 TP TYCO 7-1452656-1" },
  { id: "TR000654", name: "TERMINAL RING M 10 TP ER-151 2.5 SQ MM" },
  { id: "TR000991", name: "TERMINAL 090 SERIES MT095 FEMALE COPPER ALLOY TP YAZAKI 7116-4026" },
  { id: "TR000641", name: "TERMINAL FUSE BRASS TP TT-1638 1.5 SQ MM" },
  { id: "TR000642", name: "TERMINAL FUSE BRASS TP TT-1738 2.0 TO 5.0 SQ MM" },
  { id: "TR000411", name: "TERMINAL RING M 8 ER-034 25.0 SQ MM" },
  { id: "TR001029", name: "TERMINAL 090 SERIES MT095 FEMALE CKK002-2.3FSB1" },
  { id: "TR001026", name: "TERMINAL CONTACT SERIES FEMALE CUSN TP TT-2324" },
  { id: "TR000418", name: "TERMINAL RING BRASS TP LA 308" },
  { id: "TR000923", name: "TERMINAL PCB SERIES FEMALE COPPER ALLOY TP JST SNAC3-A001T-M0.64" },
  { id: "TR000924", name: "TERMINAL PCB SERIES FEMALE PB TP JAE IL-AG5-C1-5000" },
  { id: "TR000910", name: "TERMINAL 025 SERIES FEMALE COPPER TP BOSCH 1928492556" },
  { id: "TR000915", name: "TERMINAL 090 SERIES MT095 FEMALE COPPER ALLOY TP SUMITOMO 8100-0460" },
  { id: "TR000255", name: "TERMINAL JOINT SERIES BRASS EXTRA BIG TT-1519" },
  { id: "TR001030", name: "TERMINAL CONTACT SERIES FEMALE CUSN TP TT-2689" },
  { id: "TR000590", name: "TERMINAL FUSE FEMALE BRASS TP TT TT 1903" },
  { id: "TR000253", name: "TERMINAL M 10 ER-035 25.0 SQ MM" },
  { id: "TR000025", name: "TERMINAL M 10 ER-128 16.0 SQ MM" },
  { id: "TR000039", name: "TERMINAL 250 SERIES 6.3 MALE BRASS HOOK TT-1865" },
  { id: "TR000002", name: "TERMINAL 230 SERIES FEMALE BRASS TP WINDOW FOR X-1" },
  { id: "TR000322", name: "TERMINAL PCB SERIES FEMALE PB TP JST SEH001T-PO.6" },
  { id: "TR000170", name: "TERMINAL 280 SERIES 2.8 FEMALE CUSN3ZN9 JD 117T FOR H8 CONN" },
  { id: "TR000328", name: "TERMINAL PCB SERIES MALE PB TP JST SPAL-001T-P0.5" },
  { id: "TR000554", name: "TERMINAL MOLEX SERIES FEMALE PB TP OX YY-5750-TTBPL" },
  { id: "TR000810", name: "TERMINAL 090 SERIES MALE H65Y TP THB 0117206" },
  { id: "TR000809", name: "TERMINAL 090 SERIES MALE H65Y TP THB 0130601" },
  { id: "TR000164", name: "TERMINAL 187 SERIES 4.8 FEMALE PB TP WINDOW DIMPLE 0.5 GAP" },
  { id: "TR000645", name: "TERMINAL FUSE IN LINE" },
  { id: "TR000518", name: "TERMINAL 110 SERIES 2.8 FEMALE BRASS ARCOTECH 0.35 SQ MM" },
  { id: "TR000529", name: "TERMINAL 187 SERIES 4.8 MALE CUFE TP TYCO 964310" },
  { id: "TR000135", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY TP 501647-1000" },
  { id: "TR000139", name: "TERMINAL 110 SERIES 2.8 MALE CUFE TP TYCO 2-964294-1 NEW" },
  { id: "TR000369", name: "TERMINAL 250 SERIES FEMALE HOOK HULANE 604922" },
  { id: "TR000236", name: "TERMINAL BULLET FEMALE BRASS CW 103 JD 039A" },
  { id: "TR000391", name: "TERMINAL PCB SERIES MALE PB TP JST SYM-001T-P0.6" },
  { id: "TR000393", name: "TERMINAL PCB SERIES FEMALE PB TP JST SHF-001T-0.8BS" },
  { id: "TR000540", name: "TERMINAL 090 SERIES 2.2 FEMALE BRASS 0.5 TO 0.75 SQ MM BUTTERFLY" },
  { id: "TR000093", name: "TERMINAL 090 SERIES MT091 MALE COPPER ALLOY TP WP HULANE 6617347KSS" },
  { id: "TR000340", name: "TERMINAL PCB SERIES FEMALE JST SXA-01T-P0.6 0.5 SQ MM" },
  { id: "TR000330", name: "TERMINAL 025 SERIES MALE BRASS TP WP YAZAKI 7114-4415-02" },
  { id: "TR000331", name: "TERMINAL PCB SERIES FEMALE COPPER ALLOY TP JST SNAC3-A021T-M0.64" },
  { id: "TR000036", name: "TERMINAL 250 SERIES 6.3 FEMALE BRASS TP WINDOW DIMPLE VINAY" },
  { id: "TR000640", name: "TERMINAL 251 SERIES 6.3 FEMALE BRASS 2.5 SQ MM" },
  { id: "TR000412", name: "TERMINAL RING M 10 ER-023 4.0 TO 6.0 SQ MM" },
  { id: "TR000370", name: "TERMINAL PCB SERIES FEMALE COPPER ALLOY TP HIROSE 763-0001-3" },
  { id: "TR000371", name: "TERMINAL PCB SERIES FEMALE CU ALLOY TP HIROSE 760-0014-6" },
  { id: "TR000686", name: "TERMINAL PCB SERIES FEMALE CU ALLOY TP HIROSE GT7-2022SCF" },
  { id: "TR000685", name: "TERMINAL PCB SERIES FEMALE COPPER ALLOY TP HIROSE GT21-2428/1.6-2.9SCF" },
  { id: "TR000684", name: "TERMINAL 090 SERIES MALE BRASS TP TYCO 368087-1" },
  { id: "TR000709", name: "TERMINAL ROUND SERIES MALE TYCO 929967-1" },
  { id: "TR001008", name: "TERMINAL 187 SERIES 4.8 FEMALE BRASS TP SUMITOMO 8240-4932" },
  { id: "TR000699", name: "TERMINAL TS SEALED SERIES MALE BRASS TP SUMITOMO 8100-3617" },
  { id: "TR000926", name: "TERMINAL 060 SERIES FEMALE COPPER ALLOY TP WP SUMITOMO 8240-0490" },
  { id: "TR000835", name: "TERMINAL 060 SERIES MALE COPPER ALLOY TP WP YAZAKI 7114-4103-02" },
  { id: "TR000854", name: "TERMINAL PCB SERIES FEMALE COPPER TP SWB 2513TH-HY2B" },
  { id: "TR000858", name: "TERMINAL NANO MQS SERIES FEMALE CUSN8 TP TYCO 2-1703930-1" },
  { id: "TR000859", name: "TERMINAL MQS SERIES FEMALE CUNISI TP TYCO 5-963715-1" },
  { id: "TR000860", name: "TERMINAL 60 SERIES MCP 1.5K FEMALE CUNISI TP TYCO 1241374-1" },
  { id: "TR000861", name: "TERMINAL 110 SERIES MCP 2.8K FEMALE CUNISI TP TYCO 1241390-1" },
  { id: "TR000862", name: "TERMINAL 250/187 SERIES MCP 6.3/4.8K FEMALE CUNISI TP TYCO 1241406-1" },
  { id: "TR000887", name: "TERMINAL 60 SERIES MALE CuFe2 TP TYCO 964269-2" },
  { id: "TR001002", name: "TERMINAL MOLEX SERIES FEMALE COPPER ALLOY MOLEX 1053002100" },
  { id: "TR000827", name: "TERMINAL MOLEX SERIES FEMALE PB TP MOLEX 2064600031" },
  { id: "TR001001", name: "TERMINAL MOLEX SERIES FEMALE PB TP MOLEX 2064600041" },
  { id: "TR000931", name: "TERMINAL RING BRASS TP LE 103 VST 4112" },
  { id: "TR000303", name: "TERMINAL MOLEX SERIES MALE PB TP 5558 39000040" },
  { id: "TR000932", name: "TERMINAL MOLEX SERIES FEMALE PB TP MOLEX 172718-3111" }
];

export default function Rejection() {
  const [activeTab, setActiveTab] = useState<"menu" | "assembly" | "crimping" | "daily">("menu");
  const [showSuccess, setShowSuccess] = useState(false);
  
  const models = fullModelDatabase.map(m => `${m.fgNumber} - ${m.modelName}`);
  const today = new Date().toISOString().split('T')[0];

  // --- ASSEMBLY STATE ---
  const [assemblyDate, setAssemblyDate] = useState(today);
  const [assemblySearch, setAssemblySearch] = useState("");
  const [showAssemblyDropdown, setShowAssemblyDropdown] = useState(false);
  const [assemblyModel, setAssemblyModel] = useState("");
  const [assemblyTotalQty, setAssemblyTotalQty] = useState("");
  const [assemblyDefects, setAssemblyDefects] = useState<Record<string, number>>({});

  // --- CRIMPING STATE ---
  const [crimpingDate, setCrimpingDate] = useState(today);
  const [crimpingSearch, setCrimpingSearch] = useState("");
  const [showCrimpingDropdown, setShowCrimpingDropdown] = useState(false);
  const [crimpingTerminal, setCrimpingTerminal] = useState("");
  const [crimpingTotalQty, setCrimpingTotalQty] = useState("");
  const [crimpingDefects, setCrimpingDefects] = useState<Record<string, number>>({});

  // --- DAILY NOTE STATE ---
  const [noteDate, setNoteDate] = useState(today);
  const [noteType, setNoteType] = useState<"process" | "raw">("process");
  const [noteItems, setNoteItems] = useState([{ sr: 1, sapCode: "", desc: "", supplier: "", reason: "", qty: "" }]);

  // Computed Search Filters
  const filteredModels = useMemo(() => models.filter(m => m.toLowerCase().includes(assemblySearch.toLowerCase())), [models, assemblySearch]);
  const filteredTerminals = useMemo(() => terminalList.filter(t => t.id.toLowerCase().includes(crimpingSearch.toLowerCase()) || t.name.toLowerCase().includes(crimpingSearch.toLowerCase())), [crimpingSearch]);

  // Computed Totals
  const assemblyTotalRejection = useMemo(() => Object.values(assemblyDefects).reduce((a, b) => a + b, 0), [assemblyDefects]);
  const crimpingTotalRejection = useMemo(() => Object.values(crimpingDefects).reduce((a, b) => a + b, 0), [crimpingDefects]);

  const handleDefectChange = (stateUpdater: any, defect: string, value: string) => {
    const num = parseInt(value, 10);
    stateUpdater((prev: any) => {
      const newState = { ...prev };
      if (isNaN(num) || num <= 0) {
        delete newState[defect];
      } else {
        newState[defect] = num;
      }
      return newState;
    });
  };

  const handleNoteItemChange = (index: number, field: string, value: string) => {
    const newItems = [...noteItems];
    (newItems[index] as any)[field] = value;
    setNoteItems(newItems);
  };

  const addNoteItem = () => {
    setNoteItems([...noteItems, { sr: noteItems.length + 1, sapCode: "", desc: "", supplier: "", reason: "", qty: "" }]);
  };

  const removeNoteItem = (index: number) => {
    const newItems = noteItems.filter((_, i) => i !== index).map((item, i) => ({ ...item, sr: i + 1 }));
    setNoteItems(newItems);
  };

  // ==========================================
  // GOOGLE APPS SCRIPT SUBMISSION URLS
  // ==========================================
  const ASSEMBLY_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzHhxAF0AsayWTIWDMSji-zADscXMnM8lpYW5YQGvoXSg7kTl8GPEuvOAxc29xPgf3cKQ/exec"; 
  const CRIMPING_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzMPGud2WCbXwV6MRbi_UG__KmjC6lGfcD4RkC1en3vNVEpZZ7_xNqmeyjBlAzBhL-L1g/exec"; 

  const submitAssembly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assemblyModel) return alert("Please select a valid model from the dropdown list.");
    if (assemblyTotalRejection === 0) return alert("Please enter at least one rejection quantity.");

    const formData = new FormData();
    formData.append("sheetName", assemblyDate); // Tab name
    formData.append("type", "Assembly");
    formData.append("Model", assemblyModel); 
    formData.append("Total Qty", assemblyTotalQty);
    formData.append("Total Rejections", assemblyTotalRejection.toString());

    Object.entries(assemblyDefects).forEach(([defect, qty]) => {
      formData.append(defect, qty.toString());
    });

    try {
      await fetch(ASSEMBLY_SCRIPT_URL, { method: "POST", mode: "no-cors", body: formData });
    } catch (err) { console.error(err); }

    triggerSuccess();
    setAssemblyModel(""); setAssemblySearch(""); setAssemblyTotalQty(""); setAssemblyDefects({}); setAssemblyDate(today);
  };

  const submitCrimping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crimpingTerminal) return alert("Please select a valid terminal from the dropdown list.");
    if (crimpingTotalRejection === 0) return alert("Please enter at least one rejection quantity.");

    const formData = new FormData();
    formData.append("sheetName", crimpingDate); // Tab name
    formData.append("type", "Crimping");
    formData.append("Terminal", crimpingTerminal); 
    formData.append("Total Qty", crimpingTotalQty);
    formData.append("Total Rejections", crimpingTotalRejection.toString());

    Object.entries(crimpingDefects).forEach(([defect, qty]) => {
      formData.append(defect, qty.toString());
    });

    try {
      await fetch(CRIMPING_SCRIPT_URL, { method: "POST", mode: "no-cors", body: formData });
    } catch (err) { console.error(err); }

    triggerSuccess();
    setCrimpingTerminal(""); setCrimpingSearch(""); setCrimpingTotalQty(""); setCrimpingDefects({}); setCrimpingDate(today);
  };

  const submitDailyNote = (e: React.FormEvent) => {
    e.preventDefault();
    const noteData = { date: noteDate, type: noteType, items: noteItems, timestamp: new Date().toISOString() };
    const existingNotes = JSON.parse(localStorage.getItem('essem_daily_notes') || '[]');
    existingNotes.push(noteData);
    localStorage.setItem('essem_daily_notes', JSON.stringify(existingNotes));

    triggerSuccess();
    setNoteDate(today); setNoteItems([{ sr: 1, sapCode: "", desc: "", supplier: "", reason: "", qty: "" }]);
  };

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setActiveTab("menu");
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {activeTab !== "menu" ? (
          <button onClick={() => setActiveTab("menu")} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6b7280' }}>
            <ArrowLeft size={28} />
          </button>
        ) : (
          <XOctagon size={28} color="#dc2626" />
        )}
        <h2 className="section-title" style={{ margin: 0 }}>
          {activeTab === "menu" ? "Rejection Entry" : 
           activeTab === "assembly" ? "Assembly Rejection" : 
           activeTab === "crimping" ? "Crimping Rejection" : "Daily Rejection Note"}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {/* --- MAIN MENU --- */}
        {activeTab === "menu" && (
          <motion.div key="menu" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="info-card" onClick={() => setActiveTab("assembly")} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', borderLeftColor: '#3b82f6' }}>
                <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '0.5rem', color: '#3b82f6' }}><Wrench size={24} /></div>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1.1rem' }}>Assembly Rejection</h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>Log defects found during routing, taping, and final assembly.</p>
                </div>
              </div>

              <div className="info-card" onClick={() => setActiveTab("crimping")} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', borderLeftColor: '#f97316' }}>
                <div style={{ backgroundColor: '#fff7ed', padding: '0.75rem', borderRadius: '0.5rem', color: '#f97316' }}><Scissors size={24} /></div>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1.1rem' }}>Crimping Rejection</h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>Log terminal, seal, and wire cutting/stripping defects.</p>
                </div>
              </div>

              <div className="info-card" onClick={() => setActiveTab("daily")} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', borderLeftColor: '#8b5cf6' }}>
                <div style={{ backgroundColor: '#f3e8ff', padding: '0.75rem', borderRadius: '0.5rem', color: '#8b5cf6' }}><FileEdit size={24} /></div>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1.1rem' }}>Daily Rejection Note</h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>Submit end-of-shift summary and supervisor remarks.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- ASSEMBLY REJECTION FORM --- */}
        {activeTab === "assembly" && (
          <motion.div key="assembly" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <form onSubmit={submitAssembly} className="info-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Date</label>
                <input type="date" required value={assemblyDate} onChange={e => setAssemblyDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Search & Select Model</label>
                <div style={{ position: 'relative' }}>
                  <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" required value={assemblySearch} 
                    onChange={e => { setAssemblySearch(e.target.value); setAssemblyModel(""); setShowAssemblyDropdown(true); }}
                    onFocus={() => setShowAssemblyDropdown(true)}
                    onBlur={() => setTimeout(() => setShowAssemblyDropdown(false), 200)}
                    placeholder="Search by FG Number or Name..." 
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.2rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>
                {showAssemblyDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: '200px', overflowY: 'auto', backgroundColor: '#fff', border: '1px solid #d1d5db', zIndex: 10, borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginTop: '4px' }}>
                    {filteredModels.length > 0 ? filteredModels.map(m => (
                      <div key={m} onMouseDown={(e) => e.preventDefault()} onClick={() => { setAssemblyModel(m); setAssemblySearch(m); setShowAssemblyDropdown(false); }} style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '0.85rem', color: '#374151' }}>
                        {m}
                      </div>
                    )) : <div style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#9ca3af' }}>No models found</div>}
                  </div>
                )}
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Total Product Quantity Built</label>
                <input type="number" required min="1" value={assemblyTotalQty} onChange={e => setAssemblyTotalQty(e.target.value)} placeholder="0" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>Defect Details</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#6b7280' }}>Enter quantity for applicable defects only.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {assemblyDefectsList.map(defect => (
                    <div key={defect} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                      <span style={{ fontSize: '0.8rem', color: '#4b5563', flex: 1 }}>{defect}</span>
                      <input 
                        type="number" min="0" placeholder="0" value={assemblyDefects[defect] || ""}
                        onChange={e => handleDefectChange(setAssemblyDefects, defect, e.target.value)}
                        style={{ width: '60px', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db', outline: 'none', textAlign: 'center' }} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', border: '1px solid #bfdbfe' }}>
                <span style={{ fontWeight: 600, color: '#1e40af' }}>Total Rejections:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d4ed8' }}>{assemblyTotalRejection}</span>
              </div>

              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={18} /> Submit Assembly Rejection
              </button>
            </form>
          </motion.div>
        )}

        {/* --- CRIMPING REJECTION FORM --- */}
        {activeTab === "crimping" && (
          <motion.div key="crimping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <form onSubmit={submitCrimping} className="info-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Date</label>
                <input type="date" required value={crimpingDate} onChange={e => setCrimpingDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Search & Select Terminal</label>
                <div style={{ position: 'relative' }}>
                  <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" required value={crimpingSearch} 
                    onChange={e => { setCrimpingSearch(e.target.value); setCrimpingTerminal(""); setShowCrimpingDropdown(true); }}
                    onFocus={() => setShowCrimpingDropdown(true)}
                    onBlur={() => setTimeout(() => setShowCrimpingDropdown(false), 200)}
                    placeholder="Search Terminal ID or Name..." 
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.2rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>
                {showCrimpingDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: '200px', overflowY: 'auto', backgroundColor: '#fff', border: '1px solid #d1d5db', zIndex: 10, borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginTop: '4px' }}>
                    {filteredTerminals.length > 0 ? filteredTerminals.map(t => (
                      <div key={t.id} onMouseDown={(e) => e.preventDefault()} onClick={() => { const val = `${t.id} - ${t.name}`; setCrimpingTerminal(val); setCrimpingSearch(val); setShowCrimpingDropdown(false); }} style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '0.8rem', color: '#374151' }}>
                        <strong>{t.id}</strong> - {t.name}
                      </div>
                    )) : <div style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#9ca3af' }}>No terminals found</div>}
                  </div>
                )}
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Total Crimp Quantity (Product)</label>
                <input type="number" required min="1" value={crimpingTotalQty} onChange={e => setCrimpingTotalQty(e.target.value)} placeholder="0" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>Defect Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {crimpingDefectsList.map(defect => (
                    <div key={defect} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff7ed', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ffedd5' }}>
                      <span style={{ fontSize: '0.8rem', color: '#9a3412', flex: 1 }}>{defect}</span>
                      <input 
                        type="number" min="0" placeholder="0" value={crimpingDefects[defect] || ""}
                        onChange={e => handleDefectChange(setCrimpingDefects, defect, e.target.value)}
                        style={{ width: '60px', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #fdba74', outline: 'none', textAlign: 'center' }} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#fff7ed', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', border: '1px solid #fed7aa' }}>
                <span style={{ fontWeight: 600, color: '#c2410c' }}>Total Rejections:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9a3412' }}>{crimpingTotalRejection}</span>
              </div>

              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={18} /> Submit Crimping Rejection
              </button>
            </form>
          </motion.div>
        )}

        {/* --- DAILY REJECTION NOTE FORM --- */}
        {activeTab === "daily" && (
          <motion.div key="daily" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <form onSubmit={submitDailyNote} className="info-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Date</label>
                <input type="date" required value={noteDate} onChange={e => setNoteDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="radio" name="rejectionType" checked={noteType === "process"} onChange={() => setNoteType("process")} style={{ transform: 'scale(1.2)' }}/> Process Rejection
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="radio" name="rejectionType" checked={noteType === "raw"} onChange={() => setNoteType("raw")} style={{ transform: 'scale(1.2)' }}/> Raw Material Rejection
                </label>
              </div>

              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Rejection Items</h4>
              {noteItems.map((item, index) => (
                <div key={index} style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '-10px', left: '-10px', background: '#8b5cf6', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>{item.sr}</span>
                  {noteItems.length > 1 && (
                    <button type="button" onClick={() => removeNoteItem(index)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  )}
                  <input type="text" required placeholder="SAP Code" value={item.sapCode} onChange={e => handleNoteItemChange(index, 'sapCode', e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db', outline: 'none' }} />
                  <input type="text" required placeholder="Part Description" value={item.desc} onChange={e => handleNoteItemChange(index, 'desc', e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db', outline: 'none' }} />
                  <input type="text" required placeholder="Name of Supplier" value={item.supplier} onChange={e => handleNoteItemChange(index, 'supplier', e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db', outline: 'none' }} />
                  <input type="text" required placeholder="Reason for Rejection" value={item.reason} onChange={e => handleNoteItemChange(index, 'reason', e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db', outline: 'none' }} />
                  <input type="number" required placeholder="Quantity" value={item.qty} onChange={e => handleNoteItemChange(index, 'qty', e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
              ))}
              <button type="button" onClick={addNoteItem} style={{ padding: '0.75rem', backgroundColor: '#e5e7eb', color: '#4b5563', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Add Another Item
              </button>
              <button type="submit" style={{ marginTop: '1rem', padding: '0.85rem', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={18} /> Save Daily Note Locally
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              style={{ backgroundColor: '#fff', padding: '2.5rem 1.5rem', borderRadius: '1rem', width: '100%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
            >
              <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: '#1f2937', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Submitted Successfully!</h3>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', margin: 0 }}>Your rejection data has been successfully recorded.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}