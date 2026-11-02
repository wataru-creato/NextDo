import { useState,useEffect} from 'react'


 export function useSchedules() {
    const [todoList, setTodoList] = useState<{ id: number; scheduleContent: string; startTime: string; endTime: string }[]>([]);

  useEffect(()=>{
        async function fetchData() {
            try {
              const response = await fetch('http://localhost:80/api/schedules');
              const data=await response.json();
              const formattedData = data.map((item: { id:number; content: string; start_time: string; end_time: string; }) => {
                return { id: item.id, scheduleContent: item.content, startTime: item.start_time, endTime: item.end_time };
              });
              setTodoList(formattedData);

            } catch (error) {
              console.error('Error fetching data:', error);
            }
    };
    
    fetchData();

  },[]);

const sortTodoList=[...todoList].sort((a,b)=>{
  return a.startTime.localeCompare(b.startTime);
});
//  return { todoList, sortTodoList };



  async function fetchPostData(data: {scheduleContent: string, startTime: string, endTime: string}) {

    try {
          
              const response = await fetch(`http://localhost:80/api/schedules`,{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',  
                          },
                    body: JSON.stringify({                 
                        scheduleContent: data.scheduleContent,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        }),
              });
               if(response.ok){
                console.log('投稿成功');
                const newSchedule = await response.json();
                setTodoList([...todoList, { 
                  id: newSchedule.id, 
                  scheduleContent: newSchedule.content, 
                  startTime: newSchedule.start_time, 
                  endTime: newSchedule.end_time }]);
                // setResetInputFlag(prevFlag => !prevFlag);
                // setIsSubmitting(prevFlag => !prevFlag);
                // setSelectedEditId(null);
               }
              
                
          
            } catch (error) {
              console.error('投稿エラー:', error);
            }
  }


    async function fetchDeleteData(checkedDeleteList:number[], previousTodoList:{ id: number; scheduleContent: string; startTime: string; endTime: string }[]) {
            try {
              const deletePromises = checkedDeleteList.map(id =>
              fetch(`http://localhost:80/api/schedules/${id}`,{
                method: 'DELETE',

              }));
              const responses = await Promise.all(deletePromises);
              const hasError = responses.some(response => !response.ok);
               if(hasError){
                console.error('削除失敗',checkedDeleteList);
                alert('削除に失敗しました。');
               }
              
                setTodoList(prevTodoList => prevTodoList.filter(todo => {
                  return !checkedDeleteList.includes(todo.id);
                }));
                //   setDeleteCheckFlag(false);
                //   setCheckedDeleteList([]);
                  alert('削除が完了しました');
          
            } catch (error) {
              console.error('Error fetching data:', error);
              alert('削除に失敗したため、削除前の状態に戻します。');
              setTodoList(previousTodoList);
            }
    };

    async function fetchUpdateData(selectedEditId:number, newContent:string, newStartTime:string, newEndTime:string,previousTodoList:{ id: number; scheduleContent: string; startTime: string; endTime: string }[]) {
    try{
      const response=await fetch(`http://localhost:80/api/schedules/${selectedEditId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          scheduleContent: newContent,
          startTime: newStartTime,
          endTime: newEndTime,
        }),
      
      });
      
      if(response.ok){
        console.error('更新失敗');
        alert('更新に失敗しました。');
      }

      alert('更新が完了しました');
    }catch (error) {
      console.error('Error updating data:', error);
       setTodoList(previousTodoList);
    }
  }
  return { todoList, sortTodoList, fetchPostData, fetchDeleteData, fetchUpdateData };
 }