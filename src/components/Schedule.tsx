import {useState,useEffect} from 'react';


function Schedule({onChange, resetInputFlag,isSubmitting}: {onChange: (data: {scheduleContent: string, startTime: string, endTime: string}) => void, resetInputFlag: boolean, isSubmitting: boolean}){
    
const [inputScheduleContent,setInputScheduleContent]=useState<string>('');
const [inputStartTime,setInputStartTime]=useState<string>('');
const [inputEndTime,setInputEndTime]=useState<string>('');

//   const [startTime,setStartTime]=useState<string>('');
//   const [endTime,setEndTime]=useState<string>('');
//   const [scheduleContent,setScheduleContent]=useState<string>('');



useEffect(() => {
  setInputScheduleContent('');
  setInputStartTime('');
  setInputEndTime('');
}, [resetInputFlag]);


// const GetScheduleContent=(data: {scheduleContent: string, startTime: string, endTime: string})=>{
//     setInputScheduleContent(data.scheduleContent);
//     setInputStartTime(data.startTime);
//     setInputEndTime(data.endTime);
//   }
  
const handleAddSchedule=()=>{
  if(inputScheduleContent ==='' || inputStartTime ==='' || inputEndTime ===''){
    console.log('すべてのフィールドを入力してください');
    alert('すべてのフィールドを入力してください');
    return;
}

  if(inputStartTime>inputEndTime){
    console.log('開始時間は終了時間より前にしてください');
    alert('開始時間は終了時間より前にしてください');
    return;
  }

  onChange({         
        scheduleContent:inputScheduleContent,
        startTime:inputStartTime,
        endTime:inputEndTime    
  })
  // if(scheduleContent !=='' || startTime !=='' || endTime !==''){
  //   setResetInputFlag(prevFlag => !prevFlag);
  //   return ;
  // }


}



//削除ボタン切り替え


const handleScheduleContentChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    
        const {name,value}=e.target;
        if(name==='scheduleContent'){
            setInputScheduleContent(value);
        }else if(name==='startTime'){
            setInputStartTime(value);
        }else if(name==='endTime'){
            setInputEndTime(value);
        } 


};


return(
    <div>
        <input type="text" name="scheduleContent" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body" value={inputScheduleContent} placeholder="スケジュール内容" onChange={handleScheduleContentChange} />
      <div className="max-w-[16rem] mx-auto grid grid-cols-2 gap-2">
        <div>
        <label className="flex justify-start">開始時間：</label>
        <div className="flex justify-start">
            <input type="time" name="startTime" className="block p-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" min="00:00" max="23:59" value={inputStartTime} onChange={handleScheduleContentChange} />
        </div>
        </div>
        <div> 
        <label className="flex justify-start">終了時間：</label>
        <div className="flex justify-start">
            <input type="time" name="endTime" className="block p-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" min="00:00" max="23:59" value={inputEndTime} onChange={handleScheduleContentChange} />
        </div>
        </div>
      </div>
<div className="flex justify-center mt-5">
        <button 
          onClick={handleAddSchedule} 
          disabled={isSubmitting}
          className={`w-full rounded-xl text-white py-2 ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-400'
          }`}
        >
          {isSubmitting ? '⏳送信中...' : 'スケジュール追加'}
        </button> 
      </div>
    </div>
    
);



}
export default Schedule;

