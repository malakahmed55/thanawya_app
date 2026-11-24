import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';

// Public client config (publishable key). Override with VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://rxqrmphatozlejdidlka.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_FEf1zYKzK_9GWKXAttclEg_yW5V06Vm";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const CARD_TEXT_COLOR = '#4a1525'; 

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#c084fc', '#f472b6', '#38bdf8', '#fbbf24', '#ffffff']
    });
  };

  const getCustomMessage = (student) => {
    const totalScore = parseFloat(student.total_degree) || 0;
    const pct = (totalScore / 320) * 100;
    const caseDesc = student.student_case_desc || '';

    if (caseDesc.includes('راسب') || caseDesc.includes('ثان')) {
      return {
        pctFormatted: pct.toFixed(2) + '%',
        verse: "{وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ ۖ وَعَسَىٰ أَن تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَّكُمْ ۗ وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ}",
        sub: "{لَا تَدْرِي لَعَلَّ اللَّهَ يُحْدِثُ بَعْدَ ذَلِكَ أَمْرًا}",
        isPass: false
      };
    }

    if (pct >= 90) {
      return {
        pctFormatted: pct.toFixed(2) + '%',
        verse: "﴿ وَكَانَ فَضْلُ اللَّهِ عَلَيْكَ عَظِيمًا ﴾",
        sub: "﴿وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِنْ كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ﴾",
        isPass: true
      };
    } 
    else if (pct >= 70) {
      return {
        pctFormatted: pct.toFixed(2) + '%',
        verse: "﴿ إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ مَنْ أَحْسَنَ عَمَلًا ﴾",
        sub: "﴿وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِنْ كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ﴾",
        isPass: true
      };
    } 
    else if (pct >= 50) {
      return {
        pctFormatted: pct.toFixed(2) + '%',
        verse: "{فَعَسَىٰ أَنْ تَكْرَهُوا شَيْئًا وَيَجْعَلَ اللَّهُ فِيهِ خَيْرًا كَثِيرًا}",
        sub: "{وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا * وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ}",
        isPass: true
      };
    } 
    else {
      return {
        pctFormatted: pct.toFixed(2) + '%',
        verse: "{وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ ۖ وَعَسَىٰ أَن تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَّكُمْ ۗ وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ}",
        sub: "{وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا * وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ}",
        isPass: true
      };
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    setLoading(true);
    setMessage('');
    setResults([]);

    const isNumeric = /^\d+$/.test(query);

    try {
      if (isNumeric) {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('seating_no', query);

        if (error) throw error;

        if (!data || data.length === 0) {
          setMessage('رقم الجلوس غير موجود، تأكد من الرقم وحاولي مجدداً!');
        } else {
          setResults(data);
          const info = getCustomMessage(data[0]);
          if (info.isPass) triggerConfetti();
        }
      } else {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .ilike('arabic_name', `%${query.replace(/[\\%_]/g, '\\$&')}%`)
          .limit(21);

        if (error) throw error;

        if (!data || data.length === 0) {
          setMessage('لم يتم العثور على أي طالب بهذا الاسم.');
        } else if (data.length > 20) {
          setMessage('الاسم متكرر بكثرة! يرجى إدخال الاسم ثلاثي أو رباعي لتحديد البحث.');
        } else {
          setResults(data);
          if (data.length === 1) {
            const info = getCustomMessage(data[0]);
            if (info.isPass) triggerConfetti();
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessage('حدث خطأ أثناء الاتصال بالداتابيز، حاول مجدداً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} dir="rtl">
      
      <div style={styles.header}>
        <div style={styles.iconCircle}>🎓</div>
        <h1 style={styles.title}>نتيجة الثانوية العامة</h1>
        <p style={styles.subtitle}>
          ابحث برقم الجلوس أو بالاسم<br />
          "اسْتَقْبِلُوا أقْدَاركم بنفسٍ راضية فاللهُ يعلمُ وأنتم لا تعلمون"
        </p>
      </div>

      <form onSubmit={handleSearch} style={styles.form}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="ادخل رقم الجلوس أو اسم الطالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'يتم البحث...' : 'استعلام'}
          </button>
        </div>
      </form>

      {message && <div style={styles.messageBox}>{message}</div>}

      <div style={styles.resultsContainer}>
        {results.map((student) => {
          const msgInfo = getCustomMessage(student);

          return (
            <div key={student.id || student.seating_no} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <span style={{ ...styles.badge, color: CARD_TEXT_COLOR }}>
                    رقم الجلوس: {student.seating_no}
                  </span>
                  <h3 style={{ ...styles.studentName, color: CARD_TEXT_COLOR }}>
                    {student.arabic_name}
                  </h3>
                  <p style={{ ...styles.caseDesc, color: CARD_TEXT_COLOR }}>
                    الحالة: {student.student_case_desc}
                  </p>
                </div>

                <div style={styles.scoresContainer}>
                  <div style={styles.scoreBox}>
                    <span style={styles.scoreLabel}>المجموع (من 320)</span>
                    <span style={styles.scoreValue}>{student.total_degree}</span>
                  </div>
                  <div style={styles.scoreBox}>
                    <span style={styles.scoreLabel}>النسبة</span>
                    <span style={styles.scoreValue}>{msgInfo.pctFormatted}</span>
                  </div>
                </div>
              </div>

              <div style={styles.divider}></div>

              <div style={styles.verseContainer}>
                <p style={{ ...styles.verseText, color: CARD_TEXT_COLOR }}>
                  {msgInfo.verse}
                </p>
                <p style={{ ...styles.verseSub, color: CARD_TEXT_COLOR }}>
                  {msgInfo.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <footer style={styles.footer}>
        <a 
          href="https://shorturl.at/sJ2Jn" 
          target="_blank" 
          rel="noopener noreferrer"
          style={styles.footerLink}
        >
          malak ahmed
        </a>
      </footer>

    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#F6D8BD',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    fontFamily: "'Cairo', sans-serif, system-ui",
    overflowX: 'hidden'
  },
  header: {
    textAlign: 'center',
    marginBottom: '35px'
  },
  iconCircle: {
    fontSize: '3.5rem',
    marginBottom: '10px'
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: '800',
    margin: '0 0 10px 0',
    color: '#4a1525',
    letterSpacing: '0px',
    lineHeight: '1.4'
  },
  subtitle: {
    color: '#5D3140',
    fontSize: '1.15rem',
    margin: 0,
    fontWeight: '700',
    lineHeight: '1.6'
  },
  form: {
    width: '100%',
    maxWidth: '650px',
    marginBottom: '30px'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '6px 8px',
    borderRadius: '20px',
    border: '2px solid #F39399',
    boxShadow: '0 10px 25px rgba(93, 49, 64, 0.15)',
    gap: '6px'
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#4a1525',
    padding: '10px 14px',
    fontSize: '1rem',
    fontFamily: "'Cairo', sans-serif",
    direction: 'rtl',
    fontWeight: '600',
    minWidth: '0'
  },
  button: {
    background: '#5D3140',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 18px',
    fontSize: '0.95rem',
    fontWeight: '700',
    fontFamily: "'Cairo', sans-serif",
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  messageBox: {
    backgroundColor: '#ffffff',
    border: '2px solid #5D3140',
    color: '#5D3140',
    padding: '16px 24px',
    borderRadius: '18px',
    maxWidth: '650px',
    width: '100%',
    textAlign: 'center',
    marginBottom: '25px',
    fontWeight: '700',
    fontSize: '1.05rem'
  },
  resultsContainer: {
    width: '100%',
    maxWidth: '700px',
    display: 'flex',
    flexDirection: 'column',
    gap: '22px'
  },
  card: {
    backgroundColor: '#F39399',
    borderRadius: '24px',
    padding: '26px',
    boxShadow: '0 15px 35px rgba(93, 49, 64, 0.25)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '18px'
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '0.95rem',
    display: 'inline-block',
    marginBottom: '8px',
    fontWeight: '800'
  },
  studentName: {
    margin: '0 0 6px 0',
    fontSize: '1.7rem',
    fontWeight: '900'
  },
  caseDesc: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: '700',
    opacity: 0.9
  },
  scoresContainer: {
    display: 'flex',
    gap: '12px'
  },
  scoreBox: {
    backgroundColor: '#ffffff',
    padding: '12px 18px',
    borderRadius: '16px',
    textAlign: 'center',
    minWidth: '100px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  scoreLabel: {
    display: 'block',
    color: '#5D3140',
    fontSize: '0.85rem',
    marginBottom: '4px',
    fontWeight: '700'
  },
  scoreValue: {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: '#4a1525'
  },
  divider: {
    height: '2px',
    backgroundColor: 'rgba(74, 21, 37, 0.15)',
    margin: '20px 0'
  },
  verseContainer: {
    padding: '18px 22px',
    borderRadius: '18px',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    border: '1px solid rgba(74, 21, 37, 0.15)',
    textAlign: 'center'
  },
  verseText: {
    fontSize: '1.35rem',
    fontWeight: '800',
    margin: '0 0 8px 0',
    lineHeight: '1.6'
  },
  verseSub: {
    fontSize: '1rem',
    margin: 0,
    fontWeight: '700',
    lineHeight: '1.6',
    opacity: 0.95
  },
  footer: {
    width: '100%',
    maxWidth: '650px',
    marginTop: '40px',
    padding: '200px  ',
    display: 'flex',
    justifyContent: 'flex-start', // دي المسؤولة عن إنه يروح أقصى الشمال
    alignItems: 'left'
  },
  footerLink: {
    fontFamily: "'Pacifico', 'Reenie Beanie', cursive, sans-serif",
    fontSize: '1.4rem',
    fontWeight: 'normal',
    color: '#4a1525',
    textDecoration: 'none',
    cursor: 'pointer',
    letterSpacing: '1px'
  }
};
