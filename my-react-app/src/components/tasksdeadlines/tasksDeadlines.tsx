import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import { format, isBefore, isAfter, isSameDay, parseISO } from "date-fns";
import { supabase } from "../../database/supabaseClient";
import "./deadlines.css";

export type Deadline = {
    id: number;
    match_id: number;
    title: string;
    notes: string | null;
    due_date: string;      
    due_time: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
};

type Props = { matchId: number };

export default function DeadlinePanel({ matchId }: Props) {
    const [me, setMe] = useState<string | null>(null);
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);
    const [loading, setLoading] = useState(true);
    const [day, setDay] = useState<Date>(new Date());

    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [dateStr, setDateStr] = useState<string>(() => format(new Date(), "yyyy-MM-dd"));
    const [timeStr, setTimeStr] = useState<string>("");

    const today = new Date();
    const soonCount = useMemo(() => {
        const in3d = new Date(); in3d.setDate(in3d.getDate() + 3);
        return deadlines.filter(d => {
        const dDate = parseISO(d.due_date);
        return (isAfter(dDate, today) || isSameDay(dDate, today)) && isBefore(dDate, in3d);
        }).length;
    }, [deadlines]);

    const overdueCount = useMemo(() => {
        return deadlines.filter(d => isBefore(parseISO(d.due_date), today)).length;
    }, [deadlines]);

    useEffect(() => {
        (async () => {
        const { data: auth } = await supabase.auth.getUser();
        setMe(auth.user?.id ?? null);
        await fetchDeadlines();
        
        const ch = supabase
            .channel(`deadlines:${matchId}`)
            .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'project_deadlines', filter: `match_id=eq.${matchId}` },
            () => fetchDeadlines()
            )
            .subscribe();
        return () => { supabase.removeChannel(ch); };
        })();
    }, [matchId]);

    const fetchDeadlines = async () => {
        setLoading(true);
        const { data, error } = await supabase
        .from("project_deadlines")
        .select("*")
        .eq("match_id", matchId)
        .order("due_date", { ascending: true })
        .order("due_time", { ascending: true, nullsFirst: true });

        if (error) {
        console.error("Error leyendo deadlines:", error.message);
        setDeadlines([]);
        } else {
        setDeadlines((data ?? []) as Deadline[]);
        }
        setLoading(false);
    };

    const createDeadline = async () => {
        if (!title.trim() || !me) return;
        const { error } = await supabase
        .from("project_deadlines")
        .insert([{
            match_id: matchId,
            title: title.trim(),
            notes: notes.trim() || null,
            due_date: dateStr,
            due_time: timeStr || null,
            created_by: me
        }]);

        if (error) {
        console.error("Error creando deadline:", error.message);
        return;
        }
        setTitle(""); setNotes(""); setTimeStr("");
        fetchDeadlines();
    };

    const updateDeadline = async (id: number, patch: Partial<Deadline>) => {
        const { error } = await supabase.from("project_deadlines").update(patch).eq("id", id);
        if (error) console.error("Error updating deadline:", error.message);
    };

    const removeDeadline = async (id: number) => {
        const { error } = await supabase.from("project_deadlines").delete().eq("id", id);
        if (error) console.error("Error deleting deadline:", error.message);
    };

    const tileContent = ({ date }: { date: Date }) => {
        const count = deadlines.filter(d => isSameDay(parseISO(d.due_date), date)).length;
        return count ? <span className="dl-dot" title={`${count} entregas`} /> : null;
    };

    const listForDay = deadlines.filter(d => isSameDay(parseISO(d.due_date), day));

    return (
        <div className="dl-wrap">
        {(soonCount > 0 || overdueCount > 0) && (
            <div className="dl-banners">
            {overdueCount > 0 && <div className="dl-banner dl-banner--danger">⚠️ {overdueCount} overdue deliveries</div>}
            {soonCount > 0 && <div className="dl-banner dl-banner--warn">⏳ {soonCount} deliveries in the next 3 days</div>}
            </div>
        )}

        <div className="dl-cols">
            <div className="dl-left">
            <Calendar value={day} onChange={(d) => setDay(d as Date)} tileContent={tileContent} />
            </div>

            <div className="dl-right">
            <h3 className="dl-subtitle">
                Deliveries for {format(day, "dd/MM/yyyy")}
            </h3>

            {loading ? (
                <p>Loading…</p>
            ) : listForDay.length === 0 ? (
                <p className="dl-empty">No deliveries this date.</p>
            ) : (
                <ul className="dl-list">
                {listForDay.map(d => (
                    <li key={d.id} className="dl-item">
                    <div className="dl-item-main">
                        <input
                        className="dl-title"
                        value={d.title}
                        onChange={(e) => updateDeadline(d.id, { title: e.target.value })}
                        />
                        <input
                        className="dl-time"
                        type="time"
                        value={d.due_time ?? ""}
                        onChange={(e) => updateDeadline(d.id, { due_time: e.target.value || null })}
                        />
                    </div>
                    <textarea
                        className="dl-notes"
                        placeholder="Comments"
                        value={d.notes ?? ""}
                        onChange={(e) => updateDeadline(d.id, { notes: e.target.value })}
                    />
                    <div className="dl-actions">
                        <button className="dl-del" onClick={() => removeDeadline(d.id)}>Delete</button>
                    </div>
                    </li>
                ))}
                </ul>
            )}

            <div className="dl-form">
                <h4>New deliverie</h4>
                <input className="dl-input" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
                <textarea className="dl-textarea" placeholder="Comments" value={notes} onChange={(e)=>setNotes(e.target.value)} />
                <div className="dl-row">
                <input className="dl-input" type="date" value={dateStr} onChange={(e)=>setDateStr(e.target.value)} />
                <input className="dl-input" type="time" value={timeStr} onChange={(e)=>setTimeStr(e.target.value)} />
                </div>
                <button className="dl-btn" onClick={createDeadline}>Add deadline</button>
            </div>
            </div>
        </div>
        </div>
    );
}
