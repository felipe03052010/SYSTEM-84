import { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../utils/auth'
import { Link } from 'react-router-dom'

const MOCK_FINANCIAL = {
  totalRevenue: 28450.00,
  monthlyRevenue: 6420.00,
  activeSubscribers: 148,
  plans: [
    { name: 'Mensal Padrão', price: 'R$ 29,90', count: 94 },
    { name: 'Trimestral VIP', price: 'R$ 79,90', count: 38 },
    { name: 'Anual Mantenedor', price: 'R$ 249,90', count: 16 }
  ],
  transactions: [
    { id: 'TX-9021', user: 'carlos_silva', plan: 'Anual Mantenedor', amount: 'R$ 249,90', date: '13/11/2026 18:22', status: 'CONFIRMADO' },
    { id: 'TX-9020', user: 'ana_retro', plan: 'Mensal Padrão', amount: 'R$ 29,90', date: '13/11/2026 15:40', status: 'CONFIRMADO' },
    { id: 'TX-9019', user: 'marcos_vhs', plan: 'Trimestral VIP', amount: 'R$ 79,90', date: '12/11/2026 21:14', status: 'CONFIRMADO' },
    { id: 'TX-9018', user: 'julia_arg', plan: 'Mensal Padrão', amount: 'R$ 29,90', date: '12/11/2026 14:05', status: 'CONFIRMADO' },
    { id: 'TX-9017', user: 'rodrigo_84', plan: 'Trimestral VIP', amount: 'R$ 79,90', date: '11/11/2026 10:30', status: 'CONFIRMADO' }
  ],
  users: [
    { id: 'usr-1', username: 'carlos_silva', email: 'carlos@email.com', plan: 'Anual Mantenedor', status: 'Ativo', expires: '13/11/2027', totalPaid: 'R$ 249,90' },
    { id: 'usr-2', username: 'ana_retro', email: 'ana.retro@email.com', plan: 'Mensal Padrão', status: 'Ativo', expires: '13/12/2026', totalPaid: 'R$ 179,40' },
    { id: 'usr-3', username: 'marcos_vhs', email: 'marcos@vhs.org', plan: 'Trimestral VIP', status: 'Ativo', expires: '12/02/2027', totalPaid: 'R$ 319,60' },
    { id: 'usr-4', username: 'julia_arg', email: 'julia@arg.net', plan: 'Mensal Padrão', status: 'Ativo', expires: '12/12/2026', totalPaid: 'R$ 89,70' },
    { id: 'usr-5', username: 'rodrigo_84', email: 'rodrigo84@tele.com', plan: 'Trimestral VIP', status: 'Ativo', expires: '11/02/2027', totalPaid: 'R$ 239,70' }
  ]
}

export default function AdminFinanceiro() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  if (currentUser.role !== 'admin') {
    return (
      <Layout>
        <section className="archive-header">
          <span className="directory">SISTEMA // ACESSO RESTRITO</span>
          <h1 style={{ color: '#ff4444' }}>[ ACESSO NEGADO ]</h1>
          <p>
            Você está conectado como <strong>{currentUser.username} (Criador)</strong>.<br />
            Criadores têm acesso total para assistir vídeos, ler artigos, livros e documentos históricos,
            mas não possuem permissão para visualizar dados financeiros ou abas administrativas.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/comunidade" style={{ padding: '0.6rem 1.2rem', border: '1px solid #33ff33', color: '#33ff33', textDecoration: 'none' }}>
              IR PARA A COMUNIDADE
            </Link>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="archive-header">
        <span className="directory">ADMIN // FINANCEIRO & ASSINATURAS</span>
        <h1>PAINEL FINANCEIRO ADMINISTRATIVO</h1>
        <p>Monitoramento em tempo real de entradas de receita, planos e assinaturas ativas por usuário.</p>
      </section>

      <section style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ border: '1px solid #33ff33', padding: '1rem', background: '#051105' }}>
            <div style={{ fontSize: '0.8rem', color: '#88cc88' }}>RECEITA TOTAL ACUMULADA</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#33ff33', marginTop: '0.5rem' }}>
              R$ {MOCK_FINANCIAL.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ border: '1px solid #33ff33', padding: '1rem', background: '#051105' }}>
            <div style={{ fontSize: '0.8rem', color: '#88cc88' }}>ENTRADA DESTE MÊS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#33ff33', marginTop: '0.5rem' }}>
              R$ {MOCK_FINANCIAL.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ border: '1px solid #33ff33', padding: '1rem', background: '#051105' }}>
            <div style={{ fontSize: '0.8rem', color: '#88cc88' }}>ASSINANTES ATIVOS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#33ff33', marginTop: '0.5rem' }}>
              {MOCK_FINANCIAL.activeSubscribers}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #33ff33', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            style={{
              background: activeTab === 'overview' ? '#33ff33' : 'transparent',
              color: activeTab === 'overview' ? '#000' : '#33ff33',
              border: '1px solid #33ff33',
              padding: '0.4rem 1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ÚLTIMAS ENTRADAS (PIX / CARTÃO)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subscribers')}
            style={{
              background: activeTab === 'subscribers' ? '#33ff33' : 'transparent',
              color: activeTab === 'subscribers' ? '#000' : '#33ff33',
              border: '1px solid #33ff33',
              padding: '0.4rem 1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ASSINATURAS POR USUÁRIO
          </button>
        </div>

        {activeTab === 'overview' && (
          <div>
            <h3 style={{ color: '#33ff33', marginBottom: '1rem' }}>&gt; REGISTRO DE TRANSAÇÕES RECEBIDAS</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'monospace' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #33ff33', color: '#88cc88' }}>
                    <th style={{ padding: '0.5rem' }}>ID</th>
                    <th style={{ padding: '0.5rem' }}>USUÁRIO</th>
                    <th style={{ padding: '0.5rem' }}>PLANO</th>
                    <th style={{ padding: '0.5rem' }}>VALOR</th>
                    <th style={{ padding: '0.5rem' }}>DATA</th>
                    <th style={{ padding: '0.5rem' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_FINANCIAL.transactions.map(tx => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid #1a331a' }}>
                      <td style={{ padding: '0.6rem 0.5rem' }}>{tx.id}</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>{tx.user}</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>{tx.plan}</td>
                      <td style={{ padding: '0.6rem 0.5rem', color: '#33ff33', fontWeight: 'bold' }}>{tx.amount}</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>{tx.date}</td>
                      <td style={{ padding: '0.6rem 0.5rem', color: '#33ff33' }}>{tx.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div>
            <h3 style={{ color: '#33ff33', marginBottom: '1rem' }}>&gt; BASE DE ASSINANTES CADASTRADOS</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'monospace' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #33ff33', color: '#88cc88' }}>
                    <th style={{ padding: '0.5rem' }}>USUÁRIO</th>
                    <th style={{ padding: '0.5rem' }}>E-MAIL</th>
                    <th style={{ padding: '0.5rem' }}>PLANO</th>
                    <th style={{ padding: '0.5rem' }}>STATUS</th>
                    <th style={{ padding: '0.5rem' }}>EXPIRA EM</th>
                    <th style={{ padding: '0.5rem' }}>TOTAL PAGO</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_FINANCIAL.users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #1a331a' }}>
                      <td style={{ padding: '0.6rem 0.5rem' }}>{u.username}</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>{u.email}</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>{u.plan}</td>
                      <td style={{ padding: '0.6rem 0.5rem', color: '#33ff33' }}>{u.status}</td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>{u.expires}</td>
                      <td style={{ padding: '0.6rem 0.5rem', fontWeight: 'bold' }}>{u.totalPaid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </Layout>
  )
}
