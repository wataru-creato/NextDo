import type { Schedule, ScheduleInput, ApiSchedule } from './types/Schedule';

// APIから受け取ったデータ1件の形式を確認する
function isApiSchedule(value: unknown): value is ApiSchedule {
    return (
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        typeof value.id === 'number' &&
        'content' in value &&
        typeof value.content === 'string' &&
        'start_time' in value &&
        typeof value.start_time === 'string' &&
        'end_time' in value &&
        typeof value.end_time === 'string'
    );
}

// APIから受け取ったデータ全体が配列で、各要素も正しいか確認する
function isApiScheduleArray(value: unknown): value is ApiSchedule[] {
    return Array.isArray(value) && value.every(isApiSchedule);
}

//APIのGETの処理
async function getSchedules(): Promise<Schedule[]> {
    try {
        const response = await fetch('http://localhost:80/api/schedules');
        const data: unknown = await response.json();

        if (!isApiScheduleArray(data)) {
            throw new Error('APIレスポンスの形式が正しくありません');
        }

        //ここでAPI側のデータ形式をフロントで扱える形に変換する
        const formattedData: Schedule[] = data.map((item) => ({

            id: item.id,
            scheduleContent: item.content,
            startTime: item.start_time,
            endTime: item.end_time

        }));
        return formattedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }

}
export { getSchedules };

//APIのPOSTの処理
async function postSchedules(data: ScheduleInput): Promise<Schedule> {
    const response = await fetch('http://localhost:80/api/schedules', {
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


    const newSchedule:unknown = await response.json();

    if (!isApiSchedule(newSchedule)) {
        throw new Error('APIレスポンスの形式が正しくありません');
    }

    const formattedData: Schedule = {
        id: newSchedule.id,
        scheduleContent: newSchedule.content,
        startTime: newSchedule.start_time,
        endTime: newSchedule.end_time
    };

    return formattedData;
}
export { postSchedules };


//APIのDELETEの処理
async function deleteSchedules(ids: number[]): Promise<void> {
    const deletePromises = ids.map(id =>
        fetch(`http://localhost:80/api/schedules/${id}`, {
            method: 'DELETE',
        })
    );

    const responses = await Promise.all(deletePromises);

      if (responses.some(response => !response.ok)) {
        throw new Error('スケジュールの削除に失敗しました');
    }
}
export { deleteSchedules };


//APIのput処理
async function putSchedule(data: ScheduleInput, id: number): Promise<Schedule> {
    const response = await fetch(`http://localhost:80/api/schedules/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            scheduleContent: data.scheduleContent,
            startTime: data.startTime,
            endTime: data.endTime,
        }),
    });
    if (!response.ok) {
        throw new Error('スケジュールの更新に失敗しました');
    }

    const updatedSchedule:unknown = await response.json();

    
    if (!isApiSchedule(updatedSchedule)) {
        throw new Error('APIレスポンスの形式が正しくありません');
    }

   const formattedData: Schedule = {
        id: updatedSchedule.id,
        scheduleContent: updatedSchedule.content,
        startTime: updatedSchedule.start_time,
        endTime: updatedSchedule.end_time
    };

    return formattedData;


}
export { putSchedule };

