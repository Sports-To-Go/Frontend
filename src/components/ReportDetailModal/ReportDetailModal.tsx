import React from 'react'
import { IoClose } from 'react-icons/io5'
import './ReportDetailModal.scss'
import ReportCardInfo from '../ReportCardInfo/ReportCardInfo'
import { auth } from '../../firebase/firebase'

interface modalReportProps {
	name: string
	close: () => void
}

const ReportDetailModal: React.FC<modalReportProps> = ({ close, name }) => {
	const currentUser = auth?.currentUser
	const token = currentUser?.getIdToken()
	console.log(token)
	return (
		<div className="backdrop" onClick={close}>
			<dialog
				className="modal-reports"
				onClick={event => {
					event.stopPropagation()
				}}
			>
				<div className="modal--header">
					<h1>{name}'s reports</h1>
					<IoClose size={30} onClick={close} cursor={'pointer'} />
				</div>
				<div className="modal--body">
					<ReportCardInfo
						title="Suji"
						reportDate="ieri"
						reportedBy="Mamaia"
						description="dsafsadsa dsadasd as dsa d asd as das d sa dsa d as da sdsa das d asd as dsa d"
					/>
					<ReportCardInfo
						title="Suji"
						reportDate="ieri"
						reportedBy="Mamaia"
						description="dsafsadsa dsadasd as dsa d asd as das d sa dsa d as da sdsa das d asd as dsa d"
					/>
					<ReportCardInfo
						title="Suji"
						reportDate="ieri"
						reportedBy="Mamaia"
						description="dsafsadsa dsadasd as dsa d asd as das d sa dsa d as da sdsa das d asd as dsa d"
					/>
					<ReportCardInfo
						title="Suji"
						reportDate="ieri"
						reportedBy="Mamaia"
						description="dsafsadsa dsadasd as dsa d asd as das d sa dsa d as da sdsa das d asd as dsa d"
					/>
					<ReportCardInfo
						title="Suji"
						reportDate="ieri"
						reportedBy="Mamaia"
						description="dsafsadsa dsadasd as dsa d asd as das d sa dsa d as da sdsa das d asd as dsa d"
					/>
					<ReportCardInfo
						title="Suji"
						reportDate="ieri"
						reportedBy="Mamaia"
						description="dsafsadsa dsadasd as dsa d asd as das d sa dsa d as da sdsa das d asd as dsa d"
					/>
					<ReportCardInfo
						title="Suji"
						reportDate="ieri"
						reportedBy="Mamaia"
						description="dsafsadsa dsadasd as dsa d asd as das d sa dsa d as da sdsa das d asd as dsa d"
					/>
					<ReportCardInfo
						title="Suji"
						reportDate="ieri"
						reportedBy="Mamaia"
						description="dsafsadsa dsadasd as dsa d asd as das d sa dsa d as da sdsa das d asd as dsa d"
					/>
					<ReportCardInfo
						title="Suji"
						reportDate="ieri"
						reportedBy="Mamaia"
						description="dsafsadsa dsadasd as dsa d asd as das d sa dsa d as da sdsa das d asd as dsa d"
					/>
					<ReportCardInfo
						title="Suji"
						reportDate="ieri"
						reportedBy="Mamaia"
						description="dsafsadsa dsadasd as dsa d asd as das d sa dsa d as da sdsa das d asd as dsa d"
					/>
					<ReportCardInfo
						title="Suji"
						reportDate="ieri"
						reportedBy="Mamaia"
						description="dsafsadsa dsadasd as dsa d asd as das d sa dsa d as da sdsa das d asd as dsa d"
					/>
				</div>
				<div className="modal--footer">
					<div className="ban--container">
						<button className="ban-user">Ban</button>
						<input type="number" min={2} placeholder="Number of days" />
					</div>
					<button className="forgive-user">Forgive</button>
				</div>
			</dialog>
		</div>
	)
}

export default ReportDetailModal
