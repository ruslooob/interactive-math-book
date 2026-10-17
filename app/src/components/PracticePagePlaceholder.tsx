export function PracticePagePlaceholder({ title }: { title: string }) {
  return (
    <div className="practice-surface">
      <span className="page-label">Практическая страница</span>
      <h2 className="practice-title">{title}</h2>
      <section className="practice-placeholder">
        <span className="content-label">Практическая рубрика</span>
        <p>Задания для самостоятельной работы пока недоступны.</p>
      </section>
    </div>
  )
}
