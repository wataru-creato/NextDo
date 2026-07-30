import { useState, useEffect } from 'react';
// import Clock from './Clock';
// import App from '../App';

function ClockAlert({currentTime, startTime,endTime, scheduleContent }: {currentTime: string, startTime: string, endTime: string, scheduleContent: string}){

    const[NewCurrentTime,setNewCurrentTime]=useState<string>(currentTime);
    const [StartAlertFlag,setStartAlertFlag]=useState<boolean>(false);
     const [EndAlertFlag,setEndAlertFlag]=useState<boolean>(false);
     const [HasStartAlertFlag,setHasStartAlertFlag]=useState<boolean>(false);
     const[HasEndAlertFlag,setHasEndAlertFlag]=useState<boolean>(false);

    useEffect(() => {
        const timerId = setInterval(() => {
        setNewCurrentTime(new Intl.DateTimeFormat('ja-JP',{ hour: '2-digit', minute: '2-digit' }).format(new Date()));
        },1000);

    if(NewCurrentTime === startTime && HasStartAlertFlag === false){
        setStartAlertFlag(true);
        setHasStartAlertFlag(true);
    }
    if(NewCurrentTime === endTime && HasEndAlertFlag === false){
        setEndAlertFlag(true);
        setHasEndAlertFlag(true);
    }

Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
        if (StartAlertFlag) {
            new Notification(`開始してください！！`,
                {
                    body: `🌅 開始：${scheduleContent}⏰${startTime}～${endTime}`
                }
            );
            setStartAlertFlag(false);
        }
        if (EndAlertFlag) {
            new Notification(`終了です！！`,
                {
                    body: `🌇 終了：${scheduleContent}⏰${startTime}～${endTime}`
                }
            );
            setEndAlertFlag(false);
        }

        if(NewCurrentTime !== startTime &&HasStartAlertFlag === true){
        setHasStartAlertFlag(false);
    }
        if(NewCurrentTime !== endTime &&HasEndAlertFlag === true){
        setHasEndAlertFlag(false);
    }
}});
    

    return () => clearInterval(timerId);

    }, [NewCurrentTime, startTime, endTime, StartAlertFlag, EndAlertFlag]);

   return null;

}
export default ClockAlert;