// import { useState } from 'react';
function DeleteSchedule({currentTime,startTime,endTime,scheduleContent}: { currentTime: string; startTime: string; endTime: string; scheduleContent: string }) {


console.log('DeleteScheduleコンポーネントがレンダリングされました');
console.log('currentTime:', currentTime);
console.log('startTime:', startTime);
console.log('endTime:', endTime);
console.log('scheduleContent:', scheduleContent);

// const handleDeleteSchedule=()=>{
//     setDeleteCheckFlag(prev=>!prev);
// }
// return (
//     // <div >
//     //     <input type="checkbox" checked={DeleteCheckFlag} onChange={handleDeleteSchedule}/>
//     // </div>
// );
}
export default DeleteSchedule;