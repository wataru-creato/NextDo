import {useState, useEffect} from 'react'

type Props={
    targetTodo: { scheduleContent: string, startTime: string, endTime: string } | undefined;
    onSave: (content: string, startTime: string, endTime: string) => void;
}

function EditSchedule({targetTodo, onSave}: Props){

    const [editContent,setEditContent]=useState<string>('');
    const [editStartTime,setEditStartTime]=useState<string>('');
    const [editEndTime,setEditEndTime]=useState<string>('');

    // targetTodoが渡されてきたら、その内容を入力フォームの初期値にセットする
    useEffect(() => {
        if (targetTodo) {
            setEditContent(targetTodo.scheduleContent);
            setEditStartTime(targetTodo.startTime);
            setEditEndTime(targetTodo.endTime);
        }
    }, [targetTodo]);

    const handleSaveSchedule=()=>{
        if(editStartTime >= editEndTime){
            alert('開始時刻は終了時刻より前に設定してください。');
            return;
        }
        // 親からもらった保存関数を呼ぶ
        onSave(editContent, editStartTime, editEndTime);
    }

    return(
        <div>
            <h3 className="font-bold mb-2">予定の編集</h3>
            <input type="text" name="scheduleContent" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body" value={editContent} placeholder="スケジュール内容" onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setEditContent(e.target.value)} />
            <div className="max-w-[16rem] mx-auto grid grid-cols-2 gap-2 mt-2">
                <label className="flex justify-start items-center">開始時間：</label>
                <div className="flex justify-start">
                    <input type="time" name="startTime" className="block p-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" min="00:00" max="23:59" value={editStartTime} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setEditStartTime(e.target.value)} />
                </div>
                <label className="flex justify-start items-center">終了時間：</label>
                <div className="flex justify-start">
                    <input type="time" name="endTime" className="block p-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" min="00:00" max="23:59" value={editEndTime} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setEditEndTime(e.target.value)} />
                </div>
            </div>
            <p className="gap-4 mt-2"><button onClick={handleSaveSchedule} className="bg-green-500 rounded-xl text-white hover:bg-blue-400 px-4 py-1">
                保存する
            </button></p>
        </div>
    )
}

export default EditSchedule;