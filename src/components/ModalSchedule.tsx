import {useState,useEffect } from "react";

type Props={
    currentTime: string, startTime: string, endTime: string, scheduleContent: string, closestSchedule: any, nextSchedule: any};


function ModalSchedule({currentTime,startTime,endTime,scheduleContent,closestSchedule,nextSchedule}: Props){
    const [StartRemainingTime, setStartRemainingTime] = useState<string>('');
    const [EndRemainingTime, setEndRemainingTime] = useState<string>('');
    const [currentTimeInMs, setCurrentTimeInMs] = useState<number>(new Date(currentTime).getTime());
     const [endTimeInMs, setEndTimeInMs] = useState<number>(new Date(endTime).getTime());
    const [startTimeInMs, setStartTimeInMs] = useState<number>(new Date(startTime).getTime());


    useEffect(()=>{
        const timer = setInterval(() => {
            setCurrentTimeInMs(new Date().getTime());
            setStartTimeInMs(new Date(`${new Date().toLocaleDateString('ja-JP').replaceAll('/', '-')} ${startTime}`).getTime());
            setEndTimeInMs(new Date(`${new Date().toLocaleDateString('ja-JP').replaceAll('/', '-')} ${endTime}`).getTime());
            setStartRemainingTime(Math.round((startTimeInMs - currentTimeInMs) / 1000).toString());
            setEndRemainingTime(Math.round((endTimeInMs - currentTimeInMs) / 1000).toString());
            
        }, 1000);
Math.round
        return () => clearInterval(timer);
    }, [currentTimeInMs, startTimeInMs, StartRemainingTime, endTimeInMs, EndRemainingTime]);

    return(
        <div>
            <h2>現在スケジュール情報</h2>
            <div className="text-4xl font-semibold">
            {currentTimeInMs < startTimeInMs ?(<p className="text-red-500">開始まで{Math.floor(parseInt(StartRemainingTime) / 60)}分{Math.floor(parseInt(StartRemainingTime) % 60)}秒</p>)
            :currentTimeInMs < endTimeInMs ?(<p className="text-blue-500">終了まで{Math.floor(parseInt(EndRemainingTime) / 60)}分{Math.floor(parseInt(EndRemainingTime) % 60)}秒</p>):(<p className="text-green-500">終了</p>)}
            </div>
            <p className="text-4xl font-bold font-black">📚内容: {scheduleContent}</p>
            <p>🌅開始時間: {startTime} 🌇終了時間: {endTime}</p>
            {/* <p>closestSchedule: {closestSchedule ? closestSchedule.scheduleContent : 'なし'}</p> */}
            <p>次回予告: {nextSchedule ? nextSchedule.scheduleContent : 'なし'}</p>
        </div>
    )
}
export default ModalSchedule;