import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header.jsx';
import { Footer } from '../Footer/Footer.jsx';
import styles from './Layout.module.css';

export function Layout() {
    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}