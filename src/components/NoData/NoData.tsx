import { FC, ReactNode } from 'react'
import './NoData.scss'

interface NoDataProps {
	children?: ReactNode
}

const NoData: FC<NoDataProps> = ({ children }) => {
	return <div className="no-data">{children}</div>
}

export default NoData
