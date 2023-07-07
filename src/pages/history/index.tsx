import { useContext } from 'react'
import { HistoryContainer, HistoryList, Status } from './style'
import { CycleContext } from '../../context/CycleContext'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function History() {
  const { cycles } = useContext(CycleContext)

  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {cycles.map((cycle) => (
              <tr key={cycle.id}>
                <td>{cycle.task}</td>
                <td> {cycle.minutesAmount} minutos</td>
                <td>
                  {formatDistanceToNow(new Date(cycle.startDate), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </td>
                {cycle.finishedDate && (
                  <Status statusColor="green">Concluido</Status>
                )}

                {cycle.interruptedDate && (
                  <Status statusColor="red">Interrompido</Status>
                )}

                {!cycle.interruptedDate && !cycle.finishedDate && (
                  <Status statusColor="yellow">Em andamento</Status>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
