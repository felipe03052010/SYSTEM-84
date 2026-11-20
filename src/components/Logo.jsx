import {Link} from 'react-router-dom'
export default function Logo(){return <span className="s84-logo" aria-hidden="true"><b>[<i>84</i>]</b><strong>SYSTEM<br/>84</strong></span>}
export function LogoLink({to='/',onClick}){return <Link to={to} onClick={onClick} aria-label="SYSTEM 84 — início"><Logo/></Link>}
