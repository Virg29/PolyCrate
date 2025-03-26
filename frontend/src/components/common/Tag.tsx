import React from 'react';
import styles from './Tag.module.css';

interface TagProps {
	text: string;
	onRemove?: () => void;
}

export const Tag: React.FC<TagProps> = ({ text, onRemove }) => {
	return (
		<span className={styles.tag}>
			{text}
			{onRemove && (
				<button
					className={styles.removeButton}
					onClick={onRemove}
					title="Remove tag"
				>
					×
				</button>
			)}
		</span>
	);
};
