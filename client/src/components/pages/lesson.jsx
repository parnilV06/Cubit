import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { trainerAPI } from '../../services/api';
import { MDXRenderer } from '../trainer/mdx';
import { LessonNavigation } from '../trainer/navigation';
import './appStyles.css';

export default function Lesson() {
  const { id } = useParams(); // URL Param :id is the slug of the lesson
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [lesson, setLesson] = useState(null);
  const [content, setContent] = useState('');
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [completionNotice, setCompletionNotice] = useState(null);

  // Scroll to top whenever lesson changes
  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.scrollTop = 0;
    }
  }, [id]);

  // Fetch lesson data and all published lessons for adjacent navigation
  useEffect(() => {
    let isMounted = true;

    const fetchLessonData = async () => {
      try {
        setLoading(true);
        setError(null);
        setCompletionNotice(null);

        const [lessonRes, allRes] = await Promise.allSettled([
          trainerAPI.getLesson(id),
          trainerAPI.getLessons(),
        ]);

        if (!isMounted) return;

        if (lessonRes.status === 'fulfilled' && lessonRes.value?.data) {
          setLesson(lessonRes.value.data.lesson);
          setContent(lessonRes.value.data.content || '');
        } else {
          const errMsg = lessonRes.reason?.response?.data?.message || lessonRes.reason?.message || 'Lesson not found.';
          throw new Error(errMsg);
        }

        if (allRes.status === 'fulfilled' && allRes.value?.data) {
          setAllLessons(allRes.value.data || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load lesson:', err);
          setError(err.message || 'Failed to load lesson content.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          // Ensure scroll top after content loads
          requestAnimationFrame(() => {
            if (pageRef.current) {
              pageRef.current.scrollTop = 0;
            }
          });
        }
      }
    };

    fetchLessonData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Derive previous and next lessons
  const { prevLesson, nextLesson } = useMemo(() => {
    if (!allLessons || allLessons.length === 0 || !lesson) {
      return { prevLesson: null, nextLesson: null };
    }

    const currentIndex = allLessons.findIndex((l) => l.slug === lesson.slug);
    if (currentIndex === -1) {
      return { prevLesson: null, nextLesson: null };
    }

    return {
      prevLesson: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      nextLesson: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
    };
  }, [allLessons, lesson]);

  const handleComplete = async () => {
    if (!lesson || completing) return;
    try {
      setCompleting(true);
      const res = await trainerAPI.completeLesson(lesson.slug);
      setLesson((prev) => (prev ? { ...prev, completed: true } : null));

      const awarded = res?.data?.awardedRating;
      if (typeof awarded === 'number' && awarded > 0) {
        setCompletionNotice(`Lesson completed! +${awarded.toFixed(2)} Trainer Rating awarded! 🎉`);
      } else {
        setCompletionNotice('Lesson completed! Great job! 🎉');
      }

      // Clear notice after 5 seconds
      setTimeout(() => {
        setCompletionNotice(null);
      }, 5000);
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
      alert('Error marking lesson as complete. Please try again.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div ref={pageRef} className="cubit-trainer-lesson-page">
        <div className="cubit-trainer-lesson-content-wrapper" style={{ gap: '16px' }}>
          <div style={{ height: '30px', width: '200px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '6px' }} />
          <div style={{ height: '50px', width: '70%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '8px' }} />
          <div style={{ height: '400px', width: '100%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '16px', marginTop: '12px' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={pageRef} className="cubit-trainer-lesson-page">
        <div className="cubit-trainer-lesson-content-wrapper">
          <button
            onClick={() => navigate('/app/trainer')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: 'var(--brand-primary, #572ff7)',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '8px 0',
              marginBottom: '20px',
              alignSelf: 'flex-start',
            }}
          >
            <ChevronLeft size={18} /> Back to Trainer
          </button>

          <div
            style={{
              width: '100%',
              padding: '36px',
              borderRadius: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              textAlign: 'left',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', marginBottom: '12px' }}>
              <AlertTriangle size={24} />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Lesson Unavailable</h2>
            </div>
            <p style={{ color: 'var(--text-secondary, #a8a8b5)', lineHeight: '1.6', margin: 0 }}>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="cubit-trainer-lesson-page">
      <div className="cubit-trainer-lesson-content-wrapper">
        {/* Top Back Breadcrumb */}
        <button
          onClick={() => navigate('/app/trainer')}
          aria-label="Back to Trainer Dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--brand-ter, #bc8be0)',
            fontFamily: 'var(--font-main, sans-serif)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '6px 0',
            marginBottom: '16px',
            alignSelf: 'flex-start',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--brand-ter, #bc8be0)'; }}
        >
          <ChevronLeft size={18} /> Back to Trainer
        </button>

        {/* Main Lesson Article Container */}
        <article className="cubit-trainer-lesson-article">
        {/* Lesson Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '20px',
            borderBottom: '1px solid var(--border-primary, #2b2b35)',
            paddingBottom: '20px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ textAlign: 'left', flex: 1, minWidth: '240px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--brand-ter, #bc8be0)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px',
              }}
            >
              <BookOpen size={13} />
              <span>{lesson?.category || 'Lesson'}</span>
              <span>&bull;</span>
              <span>{lesson?.difficulty || 'Beginner'}</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading, Rajdhani, sans-serif)',
                color: '#ffffff',
                margin: '0 0 10px 0',
                fontSize: '32px',
                fontWeight: '700',
                lineHeight: '1.2',
                letterSpacing: '0.01em',
              }}
            >
              {lesson?.title}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: '13px',
                color: 'var(--text-muted, #7a7a88)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                {lesson?.estimatedMinutes || 5} min read & practice
              </span>
            </div>
          </div>

          {/* Header Action Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            {lesson?.completed ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#22c55e',
                  fontWeight: '700',
                  fontSize: '13px',
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                }}
              >
                <CheckCircle2 size={16} />
                Completed
              </div>
            ) : (
              <button
                onClick={handleComplete}
                disabled={completing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, var(--brand-primary, #572ff7), #3b1cb3)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '9px 20px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: completing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(87, 47, 247, 0.35)',
                  opacity: completing ? 0.7 : 1,
                  transition: 'all 0.15s ease',
                }}
              >
                <Sparkles size={14} />
                {completing ? 'Completing...' : 'Mark as Complete'}
              </button>
            )}
          </div>
        </header>

        {/* Completion Success Toast Notification */}
        {completionNotice && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#22c55e',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '20px',
              textAlign: 'left',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{completionNotice}</span>
          </div>
        )}

        {/* MDX Educational Content Body */}
        <main className="lesson-body-content" style={{ width: '100%' }}>
          <MDXRenderer content={content} />
        </main>

        {/* Bottom Navigation */}
        <footer style={{ marginTop: '20px' }}>
          <LessonNavigation
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            completed={lesson?.completed}
            completing={completing}
            onComplete={handleComplete}
          />
        </footer>
      </article>
    </div>
  </div>
  );
}
