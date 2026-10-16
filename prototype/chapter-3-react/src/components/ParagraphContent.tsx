import type { ExampleData, MethodData, NoteData, ParagraphData, PropertyItem } from '../content/chapter3'
import { Formula } from './Formula'

function ExplanationHint({ children }: { children: string }) {
  return (
    <span className="explanation-hint" tabIndex={0} aria-label={children}>
      <span aria-hidden="true">?</span>
      <span role="tooltip">{children}</span>
    </span>
  )
}

export function PropertiesBlock({ title, properties }: { title: string; properties: PropertyItem[] }) {
  return (
    <section className="properties-block">
      <div className="section-heading">
        <span className="content-label">Свойства</span>
        <h2>{title}</h2>
      </div>
      <ul className="property-list">
        {properties.map((property) => (
          <li key={property.term}>
            <div className="property-line">
              <strong>{property.term}:</strong>
              <Formula className="property-formula">{property.formula}</Formula>
              <ExplanationHint>{property.explanation}</ExplanationHint>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ExampleDetails({ example }: { example: ExampleData }) {
  return (
    <article className="example-card">
      <div className="section-heading">
        <h2>{example.title}</h2>
      </div>
      {example.formula && <Formula display>{example.formula}</Formula>}
      {example.table && (
        <table>
          <tbody>
            {example.table.values.map((row, rowIndex) => (
              <tr key={example.table?.labels[rowIndex]}>
                <th scope="row">{example.table?.labels[rowIndex]}</th>
                {row.map((value, index) => <td key={`${rowIndex}-${index}`}>{value}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {example.steps && (
        <ol className="example-steps">
          {example.steps.map((step, index) => (
            <li key={`${step.formula}-${index}`}>
              <Formula className="example-step-formula">{step.formula}</Formula>
              {step.note && <span className="example-step-note">{step.note}</span>}
            </li>
          ))}
        </ol>
      )}
    </article>
  )
}

export function ExampleBlock({ example, variants = [], collectionTitle }: { example: ExampleData; variants?: ExampleData[]; collectionTitle?: string }) {
  const examples = [example, ...variants]

  if (examples.length === 1) {
    return (
      <section className="example-block">
        <span className="content-label">Пример</span>
        <ExampleDetails example={example} />
      </section>
    )
  }

  return (
    <section className="example-collection">
      <div className="section-heading">
        <span className="content-label">Примеры</span>
        <h2>{collectionTitle ?? 'Варианты задач'}</h2>
      </div>
      <div className="example-grid">
        {examples.map((item) => <ExampleDetails example={item} key={item.title} />)}
      </div>
    </section>
  )
}

export function MethodBlock({ method }: { method: MethodData }) {
  return (
    <section className="method-block">
      <div className="section-heading">
        <span className="content-label">Методика решения</span>
        <h2>{method.title}</h2>
      </div>
      <p className="method-lead">{method.lead}</p>
      <ol className="method-steps">
        {method.steps.map((step) => (
          <li key={step.title}>
            <div>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </div>
            {step.formula && <Formula>{step.formula}</Formula>}
          </li>
        ))}
      </ol>
    </section>
  )
}

export function NotesBlock({ notes }: { notes: NoteData[] }) {
  return (
    <section className="notes-block">
      {notes.map((note) => (
        <article key={note.title}>
          <span className="attention-icon" aria-hidden="true">!</span>
          <div>
            <strong>{note.title}</strong>
            <p>{note.text}</p>
          </div>
        </article>
      ))}
    </section>
  )
}

export function ParagraphConclusion({ paragraph }: { paragraph: ParagraphData }) {
  return (
    <>
      {paragraph.properties.length > 0 && <PropertiesBlock title={paragraph.propertiesTitle} properties={paragraph.properties} />}
      {paragraph.notes.length > 0 && <NotesBlock notes={paragraph.notes} />}
    </>
  )
}
