'use client'
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

type Props = {
	value: Date | null;
	onChange: (v: Date | null) => void;
};

export const DatePicker = ({ value, onChange }: Props) => {
	return (
		<div>
			<DayPicker 
				mode='single'
				selected={value ?? undefined}
				onSelect={(date) => onChange(date ?? null)}
			/>

			<div>
				{value ? value.toLocaleDateString() : "日付未選択"}
			</div>
		</div>
	);
};