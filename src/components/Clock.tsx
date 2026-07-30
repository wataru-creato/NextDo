import { useState, useEffect } from 'react';
function Clock(){
    const [currentTime,setCurrentTime]=useState<string>(new Date().toLocaleTimeString());

    useEffect(()=>{
        const timerId=setInterval(()=>{
            setCurrentTime(new Date().toLocaleTimeString());
        },1000);

        return()=>clearInterval(timerId);
    },[]);

    return(
        <div>時刻：{currentTime}</div>
    );
};

export default Clock;