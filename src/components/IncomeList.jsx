import { Download, LoaderCircle, Mail } from "lucide-react";
import moment from "moment";
import TransactionInfoCard from "./TransactionInfoCard";
import { useState } from "react";

const IncomeList = ({transactions, onDelete, onDownload, onEmail}) => {

  const [loading, setLoading] = useState(false);

  const handleEmail = async () => {
    setLoading(true);
    try {
      await onEmail();
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = async () => {
    setLoading(true);
    try {
      await onDownload();
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="card p-4 bg-white shadow-sm rounded border border-gray-200">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold">Income Sources</h5>
        <div className="flex items-center justify-end gap-2">
          <button disabled={loading} className="card-btn flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50" onClick={handleEmail}>
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Emailing...
              </>
              ) : (
                <>
                  <Mail size={15} className="text-base" /> Email
                </>
              )}
          </button>
          <button disabled={loading} className="card-btn flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50" onClick={handleDownload}>
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Downloading...
              </>
              ) : (
                <>
                  <Download size={15} className="text-base" /> Download
                </>
              )}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/*display income*/}
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income.id}
            icon={income.icon}
            title={income.name}
            date={moment(income.date).format("DD MMM, YYYY")}
            amount={income.amount}
            type="income"
            onDelete={() => onDelete(income.id)}
          />
        ))}
      </div>
    </div>
  )
}
export default IncomeList;