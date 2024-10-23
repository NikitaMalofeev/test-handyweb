import Link from 'next/link';
import styles from './styles.module.scss';


export const Header = () => {
    return (
        <div className={styles.Header}>
            <Link href="/favorite-page">
                <span>Favorites</span>
            </Link>
        </div>
    );
};