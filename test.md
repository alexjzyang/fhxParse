### S0000, Start
### S0010, Initialise Phase
-   A010, Reset Post Inoculation Timer, Set Post Inoculation Timer Complete Time and Description
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure"";
'^/P_MSG2.CV' := ""Initializing the Post Inoculation Timer"";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Reset Post Inoculation Timer, Set Post Inoculation Timer Complete Time and Description
=====================================================================================
*)
'//#UNIT_SUPPORT#/TMR2/TM_RESET.CV' := TRUE;
'//#UNIT_SUPPORT#/TMR2/TM_SP.CV' := '^/R_POST_INOC_TM.CV';
'//#UNIT_SUPPORT#/TMR2/TM_EU.CV' := '$time:Minutes';
'//#UNIT_SUPPORT#/TMR2/TM_TYPE.CV' := '_TIMER_TYPE:Continuous';
'//#UNIT_SUPPORT#/TMR2/TM_DESC.CV' := ""Post Inoculation Timer"";
'//#UNIT_SUPPORT#/TMR2/HH_MM_SS_ENAB.CV' := TRUE;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   EXIT, Continue Next Task
```js
'^/P_MSG1.CV' := """";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Set U.System.Proc = 3 (Cell Expansion)
Set State = 1 (Running)
=====================================================================================
*)
'/UP001_VALUE.CV' := 'S_50L_WAVEROCKER_SYSTEM_PROCEDURE:Cell Expansion';
'/UP002_VALUE.CV' := 'S_50L_WAVEROCKER_SYSTEM_STATUS:Running';
(*
=====================================================================================
Set Task Pointer
=====================================================================================
*)
'^/P_TASK_PTR.CV' := 1;
(*
-------------------------------------------------------------------------------------
Set First Pass Flag to True
-------------------------------------------------------------------------------------
*)
'^/P_FIRST_PASS.CV' := TRUE;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
### S0020, Disable Alarms
-   A010, Enable Required Hold Monitors
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure"";
'^/P_MSG2.CV' := ""Enable Hold Monitors"";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Enable Required Hold Monitors
=====================================================================================
*)
'^/FAIL_MONITOR/HM_01.CV' := FALSE;
'^/FAIL_MONITOR/HM_02.CV' := FALSE;
'^/FAIL_MONITOR/HM_03.CV' := FALSE;
'^/FAIL_MONITOR/HM_04.CV' := FALSE;
'^/FAIL_MONITOR/HM_05.CV' := FALSE;
'^/FAIL_MONITOR/HM_06.CV' := FALSE;
'^/FAIL_MONITOR/HM_07.CV' := FALSE;
'^/FAIL_MONITOR/HM_08.CV' := FALSE;
'^/FAIL_MONITOR/HM_09.CV' := FALSE;
'^/FAIL_MONITOR/HM_10.CV' := FALSE;
'^/FAIL_MONITOR/HM_11.CV' := FALSE;
'^/FAIL_MONITOR/HM_12.CV' := FALSE;
'^/FAIL_MONITOR/HM_13.CV' := FALSE;
'^/FAIL_MONITOR/HM_14.CV' := FALSE;
'^/FAIL_MONITOR/HM_15.CV' := FALSE;
'^/FAIL_MONITOR/HM_16.CV' := FALSE;
(*
-------------------------------------------------------------------------------------
Start Inline Wait -- Ensures HM are Evaluated Prior to 
Proceeding
-------------------------------------------------------------------------------------
*)
'^/P_TIME_SAVE.CV' := 'S0020/TIME.CV';
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
### S0030, Acquire Equipment
-   A010, Acquire Devices
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure"";
'^/P_MSG2.CV' := ""Acquire the Equipment Modules and Devices"";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
-------------------------------------------------------------------------------------
Acquire Shared Modules
-------------------------------------------------------------------------------------
*)
IF ( '//#ROCKER_ANGLE#/OWNER_ID.CV' = ""(None)"") THEN '//#ROCKER_ANGLE#/OWNER_ID.CV' := '//#THISUNIT#/THISUNIT.CV'; ENDIF;
IF ( '//#ROCKER_SPEED#/OWNER_ID.CV' = ""(None)"") THEN '//#ROCKER_SPEED#/OWNER_ID.CV' := '//#THISUNIT#/THISUNIT.CV'; ENDIF;
IF ( '//#BAG_TEMP#/OWNER_ID.CV' = ""(None)"") THEN '//#BAG_TEMP#/OWNER_ID.CV' := '//#THISUNIT#/THISUNIT.CV'; ENDIF;
IF ( '//#BAG_DO#/OWNER_ID.CV' = ""(None)"") THEN '//#BAG_DO#/OWNER_ID.CV' := '//#THISUNIT#/THISUNIT.CV'; ENDIF;
IF ( '//#AIR_OVRLY_FLW#/OWNER_ID.CV' = ""(None)"") THEN '//#AIR_OVRLY_FLW#/OWNER_ID.CV' := '//#THISUNIT#/THISUNIT.CV'; ENDIF;
IF ( '//#O2_SPRG_FLW#/OWNER_ID.CV' = ""(None)"") THEN '//#O2_SPRG_FLW#/OWNER_ID.CV' := '//#THISUNIT#/THISUNIT.CV'; ENDIF;
IF ( '//#XFER_PUMP#/OWNER_ID.CV' = ""(None)"") THEN '//#XFER_PUMP#/OWNER_ID.CV' := '//#THISUNIT#/THISUNIT.CV'; ENDIF;
(*
-------------------------------------------------------------------------------------
Start Inline Wait -- Ensures Owners are Evaluated Prior 
to Proceeding
-------------------------------------------------------------------------------------
*)
'^/P_TIME_SAVE.CV' := 'S0030/TIME.CV';
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A020, Enable Hold Monitor for Loss of Module Ownership
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure"";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Enable Hold Monitor for Loss of Module Ownership
=====================================================================================
*)
'^/FAIL_MONITOR/HM_01.CV' := TRUE;
(*
-------------------------------------------------------------------------------------
Start Inline Wait -- Ensures Owners are Evaluated Prior 
to Proceeding
-------------------------------------------------------------------------------------
*)
'^/P_TIME_SAVE.CV' := 'S0030/TIME.CV';
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
### S0040, Acquire Failure
-   A010, Prompt Operator: Acquire Failed
```js
'^/P_MSG1.CV' := ""Acquire Failed"";
'^/P_MSG2.CV' := ""Devices Not Acquired: "";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:PROMPT';  

COUNT := 0;
MAX_COUNT := 7;

IF ( ( '//#ROCKER_ANGLE#/OWNER_ID.CV' != '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/ROCKER_ANGLE.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/ROCKER_ANGLE.CV';
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

IF ( ( '//#ROCKER_SPEED#/OWNER_ID.CV' != '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/ROCKER_SPEED.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/ROCKER_SPEED.CV';
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

IF ( ( '//#BAG_TEMP#/OWNER_ID.CV' != '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/BAG_TEMP.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/BAG_TEMP.CV';
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

IF ( ( '//#BAG_DO#/OWNER_ID.CV' != '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/BAG_DO.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/BAG_DO.CV' ;
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;


IF ( ( '//#AIR_OVRLY_FLW#/OWNER_ID.CV' != '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/AIR_OVRLY_FLW.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/AIR_OVRLY_FLW.CV';
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

IF ( ( '//#O2_SPRG_FLW#/OWNER_ID.CV' != '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/O2_SPRG_FLW.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/O2_SPRG_FLW.CV';
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

IF ( ( '//#XFER_PUMP#/OWNER_ID.CV' != '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/XFER_PUMP.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/XFER_PUMP.CV';
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

(*
=================================================================================
Below: Prompt Message to Operator
=================================================================================
*)

'^/FAIL_MONITOR/OAR/VERIFY.CV' := '_OAR_VERIFY:None';
'^/FAIL_MONITOR/OAR/ACTION.CV' := '_OAR_ACTION:Ask Again';       
'^/FAIL_MONITOR/OAR/OAR_STATUS.CV' := '_OAR_STATUS:ACTIVE';
'^/FAIL_MONITOR/OAR/DEFAULT.CV' := 0;
'^/FAIL_MONITOR/OAR/TYPE.CV' := '_OAR_TYPE_BOI:OK Input';
'^/FAIL_MONITOR/OAR/TIME.CV' := 0;
```
-   EXIT, Clear Message After A010 is Complete
```js
'^/P_MSG1.CV' := """";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
```
### S0050, Enable HM & SM
-   A010, Enable Hold and Sentinel Monitors
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure"";
'^/P_MSG2.CV' := ""Enable Hold and Sentinel Monitors"";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Enable Hold Monitors
=====================================================================================
*)
'^/FAIL_MONITOR/HM_02.CV' := TRUE;
'^/FAIL_MONITOR/HM_03.CV' := TRUE;
'^/FAIL_MONITOR/HM_04.CV' := TRUE;
'^/FAIL_MONITOR/HM_05.CV' := TRUE;
'^/FAIL_MONITOR/HM_06.CV' := TRUE;
'^/FAIL_MONITOR/HM_07.CV' := FALSE;
'^/FAIL_MONITOR/HM_08.CV' := FALSE;
'^/FAIL_MONITOR/HM_09.CV' := FALSE;
'^/FAIL_MONITOR/HM_10.CV' := FALSE;
'^/FAIL_MONITOR/HM_11.CV' := FALSE;
'^/FAIL_MONITOR/HM_12.CV' := FALSE;
'^/FAIL_MONITOR/HM_13.CV' := FALSE;
'^/FAIL_MONITOR/HM_14.CV' := FALSE;
'^/FAIL_MONITOR/HM_15.CV' := FALSE;
'^/FAIL_MONITOR/HM_16.CV' := FALSE;
(*
=====================================================================================
Enable Sentinel Monitors
=====================================================================================
*)
'^/FAIL_MONITOR/SM_01.CV' := TRUE;
'^/FAIL_MONITOR/SM_02.CV' := TRUE;
'^/FAIL_MONITOR/SM_03.CV' := TRUE;
'^/FAIL_MONITOR/SM_04.CV' := TRUE;
'^/FAIL_MONITOR/SM_05.CV' := TRUE;
'^/FAIL_MONITOR/SM_06.CV' := TRUE;
'^/FAIL_MONITOR/SM_07.CV' := TRUE;
'^/FAIL_MONITOR/SM_08.CV' := TRUE;
'^/FAIL_MONITOR/SM_09.CV' := TRUE;
'^/FAIL_MONITOR/SM_10.CV' := TRUE;
'^/FAIL_MONITOR/SM_11.CV' := TRUE;
'^/FAIL_MONITOR/SM_12.CV' := FALSE;
'^/FAIL_MONITOR/SM_13.CV' := FALSE;
'^/FAIL_MONITOR/SM_14.CV' := FALSE;
'^/FAIL_MONITOR/SM_15.CV' := FALSE;
'^/FAIL_MONITOR/SM_16.CV' := FALSE;
'^/FAIL_MONITOR/SM_17.CV' := FALSE;
'^/FAIL_MONITOR/SM_18.CV' := FALSE;
'^/FAIL_MONITOR/SM_19.CV' := FALSE;
'^/FAIL_MONITOR/SM_20.CV' := FALSE;
'^/FAIL_MONITOR/SM_21.CV' := FALSE;
'^/FAIL_MONITOR/SM_22.CV' := FALSE;
'^/FAIL_MONITOR/SM_23.CV' := FALSE;
'^/FAIL_MONITOR/SM_24.CV' := FALSE;
'^/FAIL_MONITOR/SM_25.CV' := FALSE;
'^/FAIL_MONITOR/SM_26.CV' := FALSE;
'^/FAIL_MONITOR/SM_27.CV' := FALSE;
'^/FAIL_MONITOR/SM_28.CV' := FALSE;
'^/FAIL_MONITOR/SM_29.CV' := FALSE;
'^/FAIL_MONITOR/SM_30.CV' := FALSE;
'^/FAIL_MONITOR/SM_31.CV' := FALSE;
'^/FAIL_MONITOR/SM_32.CV' := FALSE;
(*
-------------------------------------------------------------------------------------
Start Inline Wait -- Ensures SM are evaluated prior
to proceeding
-------------------------------------------------------------------------------------
*)
'^/P_TIME_SAVE.CV' := 'S0050/TIME.CV'
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A020, Reset Hold Request
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure"";
'^/P_MSG2.CV' := ""Resetting Hold Request"";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Reset Hold request of Shared Devices with Queue and without Queue 
=====================================================================================
*)
'^/P_HOLD_REQ.CV':= FALSE;
(*
-------------------------------------------------------------------------------------
Start Inline Wait -- Ensures HOLD_REQ of Devices is 
Reset Prior to Proceeding
-------------------------------------------------------------------------------------
*)
'^/P_TIME_SAVE.CV' := 'S0050/TIME.CV';
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A030, Initialize process alarms
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure"";
'^/P_MSG2.CV' := ""Initializing process alarms"";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Initialize process alarms
=====================================================================================
*)
'//#ROCKER_ANGLE#/HI_LIM.CV' := '^/R_ROCK_ANGLE_APH.CV';
'//#ROCKER_ANGLE#/LO_LIM.CV' := '^/R_ROCK_ANGLE_APL.CV'; 
'//#ROCKER_SPEED#/HI_LIM.CV' := '^/R_ROCK_SPEED_APH.CV';
'//#BAG_TEMP#/HI_LIM.CV' := '^/R_BAG_TEMP_APH.CV'; 
'//#BAG_TEMP#/LO_LIM.CV' := '^/R_BAG_TEMP_APL.CV';
'//#BAG_DO#/HI_LIM.CV' := '^/R_DO_APH.CV'; 
'//#BAG_DO#/LO_LIM.CV' := '^/R_DO_APL.CV'; 
'//#AIR_OVRLY_FLW#/HI_LIM.CV' := '^/R_AIR_FLOW_APH.CV'; 
'//#AIR_OVRLY_FLW#/LO_LIM.CV' := '^/R_AIR_FLOW_APL.CV'; 
'//#O2_SPRG_FLW#/HI_LIM.CV' := '^/R_O2_FLOW_APH.CV'; 
'//#O2_SPRG_FLW#/LO_LIM.CV' := '^/R_O2_FLOW_APL.CV'; 
'//#BAG_PH#/HI_LIM.CV' := '^/R_PH_APH.CV'; 
'//#BAG_PH#/LO_LIM.CV' := '^/R_PH_APL.CV';
'//#BAG_PRESS#/HI_LIM.CV' := '^/R_PRESS_APH.CV'; 
'//#BAG_PRESS#/LO_LIM.CV' := '^/R_PRESS_APL.CV';
'//#BAG_WGT#/HI_LIM.CV' := '^/R_WEIGHT_APH.CV';
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   EXIT, Continue Next Task
```js
'^/P_MSG1.CV' := """";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Reset P_PHASE_HELD
=====================================================================================
*)
'^/P_PHASE_HELD.CV' := FALSE;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
### S0100, Task1 - Inoculation
-   A010, Reset OAR and Set devices to correct states for the current step
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Inoculation Task"";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
RESET the OAR
=====================================================================================
*)
'^/FAIL_MONITOR/OAR/TYPE.CV' := '_OAR_TYPE_BOI:Reset';
(*
=====================================================================================
Disable Rocker Angle LO Alarm before Rocking is Stopped
=====================================================================================
*)
IF '^/P_XFR_COMPL.CV' = FALSE THEN
	'//#ROCKER_ANGLE#/LO_ALM.ENAB' := False; 
(*
=====================================================================================
Set Device States
=====================================================================================
*)
	'//#AIR_OVRLY_FLW#/TP01.CV' := True;
	'//#O2_SPRG_FLW#/TP01.CV' := False;
	'//#XFER_PUMP#/TP01.CV' := False;
	'//#BAG_TEMP#/TP01.CV' := True;
	'//#ROCKER_ANGLE#/TP01.CV' := False;
	'//#ROCKER_SPEED#/TP01.CV' := False;
	'//#BAG_DO#/TP01.CV' := False;

	'//#AIR_OVRLY_FLW#/MODE.TARGET' := RCAS;
	'//#O2_SPRG_FLW#/MODE.TARGET' := RCAS;
	'//#XFER_PUMP#/MODE.TARGET' := RCAS;
	'//#BAG_TEMP#/MODE.TARGET' := RCAS;
	'//#ROCKER_ANGLE#/MODE.TARGET' := RCAS;
	'//#ROCKER_SPEED#/MODE.TARGET' := RCAS;
	'//#BAG_DO#/MODE.TARGET' := RCAS;

	'//#AIR_OVRLY_FLW#/REQ_SP.CV' := '^/R_AIR_FLOW_SP.CV';
	'//#XFER_PUMP#/REQ_SP.CV' := 0;
	'//#BAG_TEMP#/REQ_SP.CV' := '^/R_TEMPERATURE_SP.CV';
	'//#O2_SPRG_FLW#/REQ_SP.CV' := 0;
	'//#ROCKER_ANGLE#/REQ_SP.CV' := 0;
	'//#ROCKER_SPEED#/REQ_SP.CV' := 0;
	'//#BAG_DO#/REQ_SP.CV' := 0;
ENDIF;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A020, Set RPT_STEP_NUM (Step Number); Set RPT_STEP_DESC (Step Description)
```js
(*
=====================================================================================
Set RPT_STEP_NUM (Step Number); Set RPT_STEP_DESC (Step Description)
=====================================================================================
*)
'^/RPT_STEP_NUM.CV'  :=  '^/P_TASK_PTR.CV';
'^/RPT_STEP_DESC.CV'  := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Inoculation Task"";
(*
=====================================================================================
Abort any outstanding Phase Request
=====================================================================================
*)
IF '^/REQUEST.CV' != 0 THEN '^/REQUEST.CV' := 6000; ENDIF;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A030, Report the Step Number (RPT_STEP_NUM) and Step Description (RPT_STEP_DESC)
```js
(*
=====================================================================================
Report the Step Number (RPT_STEP_NUM) and Step Description (RPT_STEP_DESC)
=====================================================================================
*)
'^/REQDATA1.CV' := 2;
'^/REQUEST.CV' := 2102;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A040, Display Message, prompt operator to setup for inoculation
```js
IF '^/P_XFR_COMPL.CV' = FALSE THEN
	'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Inoculation Task"";
	'^/P_MSG2.CV' := ""Perform Manual Setup for Inoculation. Acknowledge to continue."";
	'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:PROMPT';    
(*
-------------------------------------------------------------------------------------
Set Prompt
-------------------------------------------------------------------------------------
*)
	'^/FAIL_MONITOR/OAR/VERIFY.CV' := '_OAR_VERIFY:None';
	'^/FAIL_MONITOR/OAR/ACTION.CV' := '_OAR_ACTION:Ask Again';       
	'^/FAIL_MONITOR/OAR/OAR_STATUS.CV' := '_OAR_STATUS:ACTIVE';
	'^/FAIL_MONITOR/OAR/DEFAULT.CV' := 0;
	'^/FAIL_MONITOR/OAR/TYPE.CV' := '_OAR_TYPE_BOI:OK Input';
	'^/FAIL_MONITOR/OAR/TIME.CV' := 0;
ENDIF;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A050, Waiting for OAR Reset
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Inoculation Task"";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
RESET the OAR
=====================================================================================
*)
'^/FAIL_MONITOR/OAR/TYPE.CV' := '_OAR_TYPE_BOI:Reset';
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A060, Display Message, prompt operator to enter Inoculum amount
```js
IF '^/P_XFR_COMPL.CV' = FALSE THEN
	'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Inoculation Task"";
	'^/P_MSG2.CV' := ""Enter amount for Inoculum Transfer. Acknowledge to begin transfer."";
	'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:PROMPT';    
(*
-------------------------------------------------------------------------------------
Set Prompt
-------------------------------------------------------------------------------------
*)
	'^/FAIL_MONITOR/OAR/VERIFY.CV' := '_OAR_VERIFY:None';
	'^/FAIL_MONITOR/OAR/ACTION.CV' := '_OAR_ACTION:Ask Again';       
	'^/FAIL_MONITOR/OAR/OAR_STATUS.CV' := '_OAR_STATUS:ACTIVE';
	'^/FAIL_MONITOR/OAR/DEFAULT.CV' := 0;
	'^/FAIL_MONITOR/OAR/TYPE.CV' := '_OAR_TYPE_BOI:FP - with Limits';
	'^/FAIL_MONITOR/OAR/HI_LIMIT.CV' := 50;
	'^/FAIL_MONITOR/OAR/LO_LIMIT.CV' := 0;
	'^/FAIL_MONITOR/OAR/TIME.CV' := 0;
ENDIF;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A070, Set Inoculum CP to Operator Input
```js
IF '^/P_XFR_COMPL.CV' = FALSE THEN
	'^/R_INOC_CP.CV' := '^/FAIL_MONITOR/OAR/INPUT.CV';
ENDIF;
```
-   A080, Set Transfer Pump Control for Inoculum transfer
```js
IF '^/P_XFR_COMPL.CV' = FALSE THEN
	'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Inoculation Task"";
	'^/P_MSG2.CV' := ""Setting DO Control Devices to Active State"";
	'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Capture initial Weight to Cell ExpansionInocInitWt
=====================================================================================
*)
	IF '^/P_INIT_WT.CV' = FALSE 
	THEN
		'^/RPT_INOC_INT_WGT.CV' := '//#BAG_WGT#/PV.CV';
		'^/P_INIT_WT.CV' := TRUE;
	ENDIF;
(*
=====================================================================================
Start Transfer Pump
=====================================================================================
*)
	'//#XFER_PUMP#/TP01.CV' := True;
	'//#XFER_PUMP#/REQ_SP.CV' := '^/R_PUMP_SPEED_SP.CV';
ENDIF;
(*
=====================================================================================
Enable process HI alarms And Heater Alarms
=====================================================================================
*)
'//#BAG_WGT#/HI_ALM.ENAB' := True;
'//#AIR_OVRLY_FLW#/HI_ALM.ENAB' := True;
'//#O2_SPRG_FLW#/HI_ALM.ENAB' := True;
'//#BAG_TEMP#/HI_ALM.ENAB' := True;
'//#ROCKER_ANGLE#/HI_ALM.ENAB' := True;
'//#ROCKER_SPEED#/HI_ALM.ENAB' := True;
'//#BAG_PH#/HI_ALM.ENAB' := True;
'//#BAG_PRESS#/HI_ALM.ENAB' := True;
'//#FILTER_HTR_ALM_A#/DISC_ALM.ENAB' := True; 
'//#FILTER_HTR_ALM_B#/DISC_ALM.ENAB' := True;
(*
=====================================================================================
Reset U.System.OpWord[3] to the Inoculation Task
=====================================================================================
*)
'//#UNIT_SUPPORT#/U_SYS_OP_WORD'[3][1] := 1;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A090, the transfer pump totalizer ≥ Inoculum CP 
```js
IF '^/P_XFR_COMPL.CV' = FALSE THEN
	'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Inoculation Task"";
	'^/P_MSG2.CV' := ""Waiting for the transfer pump totalizer >= Inoculum CP ""  + '^/R_INOC_CP.CV'  + "" kg"";
	'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
ENDIF;
(*
=====================================================================================
RESET the OAR
=====================================================================================
*)
'^/FAIL_MONITOR/OAR/TYPE.CV' := '_OAR_TYPE_BOI:Reset';
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A100, Display System weight to operator. Enable process LO alarms
```js
(*
=====================================================================================
Display System Weight to operator.
=====================================================================================
*)
IF
    ('S0100/A090/STATE.CV' = '$sfc_action_states:Active')
THEN
   '^/P_MSG2.CV' := ""Waiting for the amount of Inoculum transferred to be >= Inoculation CP: "" + (ROUND(10 * '^/R_INOC_CP.CV') / 10) + "" kg, PV: "" 
                                + (ROUND(10 * ('//#BAG_WGT#/PV.CV' - '^/RPT_INOC_INT_WGT.CV')) / 10) + "" kg"";
ENDIF;
(*
=====================================================================================
Enable Temperature process LO alarm
=====================================================================================
*)
IF ('//#BAG_TEMP#/PV.CV' > '//#BAG_TEMP#/LO_LIM.CV') AND '//#BAG_TEMP#/LO_ALM.ENAB' = False
THEN
	'//#BAG_TEMP#/LO_ALM.ENAB' := True; 
ENDIF;
(*
=====================================================================================
Enable Air Flow process LO alarm
=====================================================================================
*)
IF ('//#AIR_OVRLY_FLW#/PV.CV' > '//#AIR_OVRLY_FLW#/LO_LIM.CV')  AND '//#AIR_OVRLY_FLW#/LO_ALM.ENAB' = False
THEN
	'//#AIR_OVRLY_FLW#/LO_ALM.ENAB' := True; 
ENDIF;
(*
=====================================================================================
Enable pH process LO alarm
=====================================================================================
*)
IF ('//#BAG_PH#/PV.CV' > '//#BAG_PH#/LO_LIM.CV')  AND '//#BAG_PH#/LO_ALM.ENAB' = False
THEN
	'//#BAG_PH#/LO_ALM.ENAB' := True; 
ENDIF;
(*
=====================================================================================
Enable Pressure process LO alarm
=====================================================================================
*)
IF ('//#BAG_PRESS#/PV.CV' > '//#BAG_PRESS#/LO_LIM.CV') AND '//#BAG_PRESS#/LO_ALM.ENAB' = False
THEN
	'//#BAG_PRESS#/LO_ALM.ENAB' := True; 
ENDIF;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A110, Set Transfer Pump Control to Idle State.
```js
IF '^/P_XFR_COMPL.CV' = FALSE THEN
	'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Inoculation Task"";
	'^/P_MSG2.CV' := ""Stopping Transfer Pump and Proceeding to Incubation (Post-Inoculation)."";
	'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Set Transfer Pump Control to Idle State.
=====================================================================================
*)
	'//#XFER_PUMP#/TP01.CV' := False;
	'//#XFER_PUMP#/REQ_SP.CV' := 0;
	
	'^/P_XFR_COMPL.CV' := TRUE;
ENDIF;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A120, Restart Rocking and Rocking Angle
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Inoculation Task"";
'^/P_MSG2.CV' := ""Restarting Rocking"";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';

'//#ROCKER_ANGLE#/TP01.CV' := True;
'//#ROCKER_SPEED#/TP01.CV' := True;

'//#ROCKER_ANGLE#/REQ_SP.CV' := '^/R_ROCK_ANGLE_SP.CV';
'//#ROCKER_SPEED#/REQ_SP.CV' := '^/R_ROCK_SPEED_SP.CV';
```
-   A130, Waiting for OAR Reset and re-enable rocker angle lo alarm
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Inoculation Task"";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
RESET the OAR
=====================================================================================
*)
'^/FAIL_MONITOR/OAR/TYPE.CV' := '_OAR_TYPE_BOI:Reset';
(*
=====================================================================================
Re-enable Rocker Angle LO Alarm
=====================================================================================
*)
'//#ROCKER_ANGLE#/LO_ALM.ENAB' := True; 
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A140, Display Message, prompt operator to acknowledge when ready toto proceed to Incubation (Post-Inoculation).
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Inoculation Task"";
'^/P_MSG2.CV' := ""Acknowledge when ready to proceed to Incubation (Post-Inoculation)."";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:PROMPT';    
(*
-------------------------------------------------------------------------------------
Set Prompt
-------------------------------------------------------------------------------------
*)
'^/FAIL_MONITOR/OAR/VERIFY.CV' := '_OAR_VERIFY:None';
'^/FAIL_MONITOR/OAR/ACTION.CV' := '_OAR_ACTION:Ask Again';       
'^/FAIL_MONITOR/OAR/OAR_STATUS.CV' := '_OAR_STATUS:ACTIVE';
'^/FAIL_MONITOR/OAR/DEFAULT.CV' := 0;
'^/FAIL_MONITOR/OAR/TYPE.CV' := '_OAR_TYPE_BOI:OK Input';
'^/FAIL_MONITOR/OAR/TIME.CV' := 0;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   EXIT, Continue Next Task
```js
'^/P_MSG1.CV' := """";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Capture Final Weight to InocFillFinalWt
=====================================================================================
*)
'^/RPT_INOC_FNL_WGT.CV' := '//#BAG_WGT#/PV.CV';
(*
=====================================================================================
Report InocFillFinalWt to MES
=====================================================================================
*)
'//#UNIT_SUPPORT#/MES_DATA_OUT/POOL_WORK_VOL.CV' := '^/RPT_INOC_FNL_WGT.CV';
(*
=====================================================================================
Set Task Pointer
=====================================================================================
*)
'^/P_TASK_PTR.CV' := 2;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
### S0200, Task2 - Incubation (Post-Inoculation)
-   A010, Set devices to correct states for the current step
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Incubation (Post-Inoculation)"";
'^/P_MSG2.CV' := ""Setting DO Control Device to Active State"";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Set Device States
=====================================================================================
*)
'//#AIR_OVRLY_FLW#/TP01.CV' := True;
'//#O2_SPRG_FLW#/TP01.CV' := True;
'//#XFER_PUMP#/TP01.CV' := False;
'//#BAG_TEMP#/TP01.CV' := True;
'//#ROCKER_ANGLE#/TP01.CV' := True;
'//#ROCKER_SPEED#/TP01.CV' := True;
'//#BAG_DO#/TP01.CV' := True;

'//#AIR_OVRLY_FLW#/MODE.TARGET' := RCAS;
'//#O2_SPRG_FLW#/MODE.TARGET' := RCAS;
'//#XFER_PUMP#/MODE.TARGET' := RCAS;
'//#BAG_TEMP#/MODE.TARGET' := RCAS;
'//#ROCKER_ANGLE#/MODE.TARGET' := RCAS;
'//#ROCKER_SPEED#/MODE.TARGET' := RCAS;
'//#BAG_DO#/MODE.TARGET' := RCAS;

'//#AIR_OVRLY_FLW#/REQ_SP.CV' := '^/R_AIR_FLOW_SP.CV';
'//#XFER_PUMP#/REQ_SP.CV' := 0;
'//#BAG_TEMP#/REQ_SP.CV' := '^/R_TEMPERATURE_SP.CV';
'//#O2_SPRG_FLW#/REQ_SP.CV' := '^/R_O2_FLOW_SP.CV';
'//#ROCKER_ANGLE#/REQ_SP.CV' := '^/R_ROCK_ANGLE_SP.CV';
'//#ROCKER_SPEED#/REQ_SP.CV' := '^/R_ROCK_SPEED_SP.CV';
'//#BAG_DO#/REQ_SP.CV' := '^/R_DO_SP.CV';
(*
=====================================================================================
Enable alarms
=====================================================================================
*)
'//#BAG_PRESS#/HI_ALM.ENAB' := True;
(*
=====================================================================================
Reset U.System.OpWord[3] to the Incubation (Post-Inoculation) Task
=====================================================================================
*)
'//#UNIT_SUPPORT#/U_SYS_OP_WORD'[3][1] := 2;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A020, Set RPT_STEP_NUM (Step Number); Set RPT_STEP_DESC (Step Description)
```js
(*
=====================================================================================
Set RPT_STEP_NUM (Step Number); Set RPT_STEP_DESC (Step Description)
=====================================================================================
*)
'^/RPT_STEP_NUM.CV'  :=  '^/P_TASK_PTR.CV';
'^/RPT_STEP_DESC.CV'  := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Incubation (Post-Inoculation) Task"";
(*
=====================================================================================
Abort any outstanding Phase Request
=====================================================================================
*)
IF '^/REQUEST.CV' != 0 THEN '^/REQUEST.CV' := 6000; ENDIF;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A030, Report the Step Number (RPT_STEP_NUM) and Step Description (RPT_STEP_DESC)
```js
(*
=====================================================================================
Report the Step Number (RPT_STEP_NUM) and Step Description (RPT_STEP_DESC)
=====================================================================================
*)
'^/REQDATA1.CV' := 2;
'^/REQUEST.CV' := 2102;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A040, Start Post Inoculation Timer and wait for Post Inoculation Timer ≥ 12 hours
```js
'^/P_MSG1.CV' := ""Incubation (Post-Inoculation) In Progress"";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Start Post Inoculation Timer
=====================================================================================
*)
'//#UNIT_SUPPORT#/TMR2/TM_HOLD.CV' := '_TIMER_HOLD:Run'; 
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A041, Enable Alarms
```js
IF
     ('S0200/A040/STATE.CV' = '$sfc_action_states:Active' OR 'S0200/A050/STATE.CV' = '$sfc_action_states:Active' OR 'S0200/A060/STATE.CV' = '$sfc_action_states:Active')
THEN
    '^/P_MSG1.CV' := ""Incubation (Post-Inoculation) in progress. Post Inoculation Elapsed Timer time: "" + '//#UNIT_SUPPORT#/TMR2/HH_MM_SS.CV';
    '^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
ENDIF;
(*
=====================================================================================
Enable DO Control and O2 Flow Deviation process alarms
=====================================================================================
*)
IF ('//#BAG_DO#/PV.CV' > '//#BAG_DO#/LO_LIM.CV') AND ('//#BAG_DO#/LO_ALM.ENAB' = False) AND ('//#SMPL_MODE#/PV_D.CV' = 0)
THEN
	'//#BAG_DO#/LO_ALM.ENAB' := True; 
ENDIF;

IF ('//#SMPL_MODE#/REQ_SP.CV' = 1) AND ('//#BAG_DO#/LO_ALM.ENAB' = True)
THEN
	'//#BAG_DO#/LO_ALM.ENAB' := False;
ENDIF;

IF ('//#BAG_DO#/PV.CV' < '//#BAG_DO#/HI_LIM.CV') AND '//#BAG_DO#/HI_ALM.ENAB' = False
THEN
	'//#BAG_DO#/HI_ALM.ENAB' := True; 
ENDIF;

IF ('//#O2_SPRG_FLW#/DV_HI_ALM.ENAB' = False) THEN
	'//#O2_SPRG_FLW#/DV_HI_ALM.ENAB' := True;
ENDIF;

IF ('//#O2_SPRG_FLW#/DV_LO_ALM.ENAB' = False) THEN
	'//#O2_SPRG_FLW#/DV_LO_ALM.ENAB' := True;
ENDIF;

(*
=====================================================================================
Enable Pressure process LO alarm
=====================================================================================
*)
IF ('//#BAG_PRESS#/PV.CV' > '//#BAG_PRESS#/LO_LIM.CV') AND '//#BAG_PRESS#/LO_ALM.ENAB' = False
THEN
	'//#BAG_PRESS#/LO_ALM.ENAB' := True; 
ENDIF;
(*
=====================================================================================
Reset Rocking Angle Alarms when in Sampling Mode
=====================================================================================
*)
IF '//#SMPL_MODE#/REQ_SP.CV' = 1 THEN
	IF '//#ROCKER_ANGLE#/HI_ALM.ENAB' = True THEN
		'//#ROCKER_ANGLE#/HI_ALM.ENAB' := False;
	ENDIF;
	IF '//#ROCKER_ANGLE#/LO_ALM.ENAB' = True THEN
		'//#ROCKER_ANGLE#/LO_ALM.ENAB' := False;
	ENDIF;
ENDIF;

IF '//#SMPL_MODE#/PV_D.CV' = 0 THEN
	IF '//#ROCKER_ANGLE#/HI_ALM.ENAB' = False AND '//#ROCKER_ANGLE#/PV.CV' < '//#ROCKER_ANGLE#/HI_LIM.CV' THEN
		'//#ROCKER_ANGLE#/HI_ALM.ENAB' := True;
	ENDIF;
	IF '//#ROCKER_ANGLE#/LO_ALM.ENAB' = False AND '//#ROCKER_ANGLE#/PV.CV' = '^/R_ROCK_ANGLE_SP.CV' THEN
		'//#ROCKER_ANGLE#/LO_ALM.ENAB' := True;
	ENDIF;
ENDIF;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A050, Waiting for OAR Reset
```js
(*
=====================================================================================
RESET the OAR
=====================================================================================
*)
'^/FAIL_MONITOR/OAR/TYPE.CV' := '_OAR_TYPE_BOI:Reset';
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A060, Display Message, Prompt operator acknowledge when ready to proceed to Transfer Out.
```js
'^/P_MSG2.CV' := ""Confirm when Incubation (Post-Inoculation) is complete."";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:PROMPT';    
(*
-------------------------------------------------------------------------------------
Set Prompt
-------------------------------------------------------------------------------------
*)
'^/FAIL_MONITOR/OAR/VERIFY.CV' := '_OAR_VERIFY:None';
'^/FAIL_MONITOR/OAR/ACTION.CV' := '_OAR_ACTION:Ask Again';       
'^/FAIL_MONITOR/OAR/OAR_STATUS.CV' := '_OAR_STATUS:ACTIVE';
'^/FAIL_MONITOR/OAR/DEFAULT.CV' := 0;
'^/FAIL_MONITOR/OAR/TYPE.CV' := '_OAR_TYPE_BOI:OK Input';
'^/FAIL_MONITOR/OAR/TIME.CV' := 0;

(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   NS065, Continually populate CULTR_INC_TM with Post Inactivation Timer
```js
'//#UNIT_SUPPORT#/MES_DATA_OUT/CULTR_INC_TM.CV' := '//#UNIT_SUPPORT#/TMR2/TM_PV.CV'/60;
```
-   EXIT, Continue Next Task
```js
'^/P_MSG1.CV' := """";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Capture actual Post Inocuation Time
=====================================================================================
*)
'^/RPT_INOC_TM.CV' := '//#UNIT_SUPPORT#/TMR2/TM_PV.CV'/60;
(*
=====================================================================================
Report Post Inoculation Time to MES
=====================================================================================
*)
'//#UNIT_SUPPORT#/MES_DATA_OUT/CULTR_INC_TM.CV' := '^/RPT_INOC_TM.CV';
(*
=====================================================================================
Stop Post Inoculation Timer
=====================================================================================
*)
'//#UNIT_SUPPORT#/TMR2/TM_HOLD.CV' := '_TIMER_HOLD:Hold'; 
(*
=====================================================================================
Set Task Pointer
=====================================================================================
*)
'^/P_TASK_PTR.CV' := 99;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
### S9900, Task99 - Complete Task
-   A010, Display Message
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Complete Task"";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A020, Set RPT_STEP_NUM (Step Number); Set RPT_STEP_DESC (Step Description)
```js
(*
=====================================================================================
Set RPT_STEP_NUM (Step Number); Set RPT_STEP_DESC (Step Description)
=====================================================================================
*)
'^/RPT_STEP_NUM.CV'  :=  '^/P_TASK_PTR.CV';
'^/RPT_STEP_DESC.CV'  := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Complete Task"";
(*
=====================================================================================
Abort any outstanding Phase Request
=====================================================================================
*)
IF '^/REQUEST.CV' != 0 THEN '^/REQUEST.CV' := 6000; ENDIF;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A030, Report the Step Number (RPT_STEP_NUM) and Step Description (RPT_STEP_DESC)
```js
(*
=====================================================================================
Report the Step Number (RPT_STEP_NUM) and Step Description (RPT_STEP_DESC)
=====================================================================================
*)
'^/REQDATA1.CV' := 2;
'^/REQUEST.CV' := 2102;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
### S9910, Release Equipment
-   A010, Disable Hold Monitors and Sentinel Monitors
```js
(*
=====================================================================================
Disable Sentinel Monitors
=====================================================================================
*)
'^/FAIL_MONITOR/SM_01.CV' := FALSE;
'^/FAIL_MONITOR/SM_02.CV' := FALSE;
'^/FAIL_MONITOR/SM_03.CV' := FALSE;
'^/FAIL_MONITOR/SM_04.CV' := FALSE;
'^/FAIL_MONITOR/SM_05.CV' := FALSE;
'^/FAIL_MONITOR/SM_06.CV' := FALSE;
'^/FAIL_MONITOR/SM_07.CV' := FALSE;
'^/FAIL_MONITOR/SM_08.CV' := FALSE;
'^/FAIL_MONITOR/SM_09.CV' := FALSE;
'^/FAIL_MONITOR/SM_10.CV' := FALSE;
'^/FAIL_MONITOR/SM_11.CV' := FALSE;
'^/FAIL_MONITOR/SM_12.CV' := FALSE;
'^/FAIL_MONITOR/SM_13.CV' := FALSE;
'^/FAIL_MONITOR/SM_14.CV' := FALSE;
'^/FAIL_MONITOR/SM_15.CV' := FALSE;
'^/FAIL_MONITOR/SM_16.CV' := FALSE;
'^/FAIL_MONITOR/SM_17.CV' := FALSE;
'^/FAIL_MONITOR/SM_18.CV' := FALSE;
'^/FAIL_MONITOR/SM_19.CV' := FALSE;
'^/FAIL_MONITOR/SM_20.CV' := FALSE;
'^/FAIL_MONITOR/SM_21.CV' := FALSE;
'^/FAIL_MONITOR/SM_22.CV' := FALSE;
'^/FAIL_MONITOR/SM_23.CV' := FALSE;
'^/FAIL_MONITOR/SM_24.CV' := FALSE;
'^/FAIL_MONITOR/SM_25.CV' := FALSE;
'^/FAIL_MONITOR/SM_26.CV' := FALSE;
'^/FAIL_MONITOR/SM_27.CV' := FALSE;
'^/FAIL_MONITOR/SM_28.CV' := FALSE;
'^/FAIL_MONITOR/SM_29.CV' := FALSE;
'^/FAIL_MONITOR/SM_30.CV' := FALSE;
'^/FAIL_MONITOR/SM_31.CV' := FALSE;
'^/FAIL_MONITOR/SM_32.CV' := FALSE;
(*
=====================================================================================
Disable Hold Monitors
=====================================================================================
*)
'^/FAIL_MONITOR/HM_01.CV' := FALSE;
'^/FAIL_MONITOR/HM_02.CV' := FALSE;
'^/FAIL_MONITOR/HM_03.CV' := FALSE;
'^/FAIL_MONITOR/HM_04.CV' := FALSE;
'^/FAIL_MONITOR/HM_05.CV' := FALSE;
'^/FAIL_MONITOR/HM_06.CV' := FALSE;
'^/FAIL_MONITOR/HM_07.CV' := FALSE;
'^/FAIL_MONITOR/HM_08.CV' := FALSE;
'^/FAIL_MONITOR/HM_09.CV' := FALSE;
'^/FAIL_MONITOR/HM_10.CV' := FALSE;
'^/FAIL_MONITOR/HM_11.CV' := FALSE;
'^/FAIL_MONITOR/HM_12.CV' := FALSE;
'^/FAIL_MONITOR/HM_13.CV' := FALSE;
'^/FAIL_MONITOR/HM_14.CV' := FALSE;
'^/FAIL_MONITOR/HM_15.CV' := FALSE;
'^/FAIL_MONITOR/HM_16.CV' := FALSE;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A020, Release Shared Devices
```js
'^/P_MSG1.CV' := """"+ '/UP001_VALUE.CVS' + "" Unit Procedure: Complete Task"";
'^/P_MSG2.CV' := ""Releasing Equipment Modules and Devices"";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Release Equipment Modules and Devices
=====================================================================================
*)
IF '//#ROCKER_ANGLE#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' THEN '//#ROCKER_ANGLE#/OWNER_ID.CV' := ""(None)""; ENDIF;
IF '//#ROCKER_SPEED#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' THEN '//#ROCKER_SPEED#/OWNER_ID.CV' := ""(None)""; ENDIF;
IF '//#BAG_TEMP#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' THEN '//#BAG_TEMP#/OWNER_ID.CV' := ""(None)""; ENDIF;
IF '//#BAG_DO#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' THEN '//#BAG_DO#/OWNER_ID.CV' := ""(None)""; ENDIF;
IF '//#AIR_OVRLY_FLW#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' THEN '//#AIR_OVRLY_FLW#/OWNER_ID.CV' := ""(None)""; ENDIF;
IF '//#O2_SPRG_FLW#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' THEN '//#O2_SPRG_FLW#/OWNER_ID.CV' := ""(None)""; ENDIF;
IF '//#XFER_PUMP#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' THEN '//#XFER_PUMP#/OWNER_ID.CV' := ""(None)""; ENDIF;
(*
-------------------------------------------------------------------------------------
Start Inline Wait -- Ensures Owners are Evaluated Prior
to Proceeding
-------------------------------------------------------------------------------------
*)
'^/P_TIME_SAVE.CV' := 'S9910/TIME.CV'
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   EXIT, Continue Next Task
```js
'^/P_MSG1.CV' := """";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
-------------------------------------------------------------------------------------
Setting Next Task
-------------------------------------------------------------------------------------
*)
'^/P_TASK_PTR.CV' := 99;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
### S9920, OAR
-   A010, Waiting for OAR Reset
```js
'^/P_MSG1.CV' := ""Release Failed "";
'^/P_MSG2.CV' := ""Waiting for OAR Reset"";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
RESET the OAR
=====================================================================================
*)
'^/FAIL_MONITOR/OAR/TYPE.CV' := '_OAR_TYPE_BOI:Reset';
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
-   A020, Display Message, Prompt Operator
```js
'^/P_MSG1.CV' := ""Release Failed"";
'^/P_MSG2.CV' := ""Devices Not Released: "";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:PROMPT';  

COUNT := 0;
MAX_COUNT := 7;

IF ( ( '//#ROCKER_ANGLE#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/ROCKER_ANGLE.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/ROCKER_ANGLE.CV';
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

IF ( ( '//#ROCKER_SPEED#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/ROCKER_SPEED.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/ROCKER_SPEED.CV';
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

IF ( ( '//#BAG_TEMP#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/BAG_TEMP.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/BAG_TEMP.CV';
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

IF ( ( '//#BAG_DO#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/BAG_DO.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/BAG_DO.CV';
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

IF ( ( '//#AIR_OVRLY_FLW#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/AIR_OVRLY_FLW.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/AIR_OVRLY_FLW.CV' ;
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

IF ( ( '//#O2_SPRG_FLW#/OWNER_ID.CV' != '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/O2_SPRG_FLW.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/O2_SPRG_FLW.CV';
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

IF ( ( '//#XFER_PUMP#/OWNER_ID.CV' = '//#THISUNIT#/THISUNIT.CV' ) AND ( COUNT < MAX_COUNT ) ) THEN
    IF ( COUNT = 0 ) THEN
        '^/P_MSG2.CV' := '^/P_MSG2.CV' +  '//#THISUNIT#/XFER_PUMP.CV';
      ELSE
        '^/P_MSG2.CV' := '^/P_MSG2.CV' + "", "" + '//#THISUNIT#/XFER_PUMP.CV';
    ENDIF;
    
    COUNT := COUNT + 1;
ENDIF;

(*
=================================================================================
Below: Prompt Message to Operator
=================================================================================
*)

'^/FAIL_MONITOR/OAR/VERIFY.CV' := '_OAR_VERIFY:None';
'^/FAIL_MONITOR/OAR/ACTION.CV' := '_OAR_ACTION:Ask Again';       
'^/FAIL_MONITOR/OAR/OAR_STATUS.CV' := '_OAR_STATUS:ACTIVE';
'^/FAIL_MONITOR/OAR/DEFAULT.CV' := 0;
'^/FAIL_MONITOR/OAR/TYPE.CV' := '_OAR_TYPE_BOI:OK Input';
'^/FAIL_MONITOR/OAR/TIME.CV' := 0;
```
-   EXIT, Exit
```js
'^/P_MSG1.CV' := """";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
### S9930, Complete
-   EXIT, Clear Phase Alarm, Complete
```js
'^/P_MSG1.CV' := """";
'^/P_MSG2.CV' := """";
'^/P_MSG_TYPE1.CV' := '_MSG_TYPE:INFO';
(*
=====================================================================================
Reset UP Parameters
=====================================================================================
*)
'/UP003_VALUE.CV' := FALSE;
'/UP004_VALUE.CV' := False;
(*
=====================================================================================
Clear Phase Alarm
=====================================================================================
*)
'/ALARMS.MACK' := 1;
(*
=====================================================================================
End of Code
=====================================================================================
*)
```
