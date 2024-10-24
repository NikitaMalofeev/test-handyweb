import styles from "./styles.module.scss";

interface LoaderProps {
    className?: string;
}

export const Loader = ({ className }: LoaderProps) => (
    <div className={styles.loader}>
        <div />
        <div />
        <div />
        <div />
    </div>
);
