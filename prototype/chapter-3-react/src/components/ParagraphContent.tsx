import { paragraph11 } from '../content/paragraph11'
import { Formula } from './Formula'

function ExplanationHint({ children }: { children: string }) {
  return (
    <span className="explanation-hint" tabIndex={0} aria-label={children}>
      <span aria-hidden="true">?</span>
      <span role="tooltip">{children}</span>
    </span>
  )
}

export function PropertiesBlock() {
  return (
    <section className="properties-block">
      <div className="section-heading">
        <span className="content-label">Свойства</span>
        <h2>Показательная функция</h2>
      </div>
      <ul className="property-list">
        {paragraph11.properties.map((property) => (
          <li key={property.term}>
            <div className="property-line">
              <strong>{property.term}:</strong>
              <Formula>{property.formula}</Formula>
              <ExplanationHint>{property.explanation}</ExplanationHint>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ExampleBlock() {
  return (
    <section className="example-block">
      <div className="section-heading">
        <span className="content-label">Пример</span>
        <h2>Функция <Formula>{'y=2^x'}</Formula></h2>
      </div>
      <table>
        <tbody>
          <tr>
            <th scope="row">x</th>
            {[-2, -1, 0, 1, 2].map((x) => <td key={x}>{x}</td>)}
          </tr>
          <tr>
            <th scope="row">y</th>
            {['0,25', '0,5', '1', '2', '4'].map((y) => <td key={y}>{y}</td>)}
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export function NotesBlock() {
  return (
    <section className="notes-block">
      <article>
        <span className="attention-icon" aria-hidden="true">!</span>
        <div>
          <strong>Граничный случай</strong>
          <p>{paragraph11.boundary}</p>
        </div>
      </article>
      <article>
        <span className="attention-icon" aria-hidden="true">!</span>
        <div>
          <strong>Обратите внимание</strong>
          <p>{paragraph11.commonError}</p>
        </div>
      </article>
    </section>
  )
}
