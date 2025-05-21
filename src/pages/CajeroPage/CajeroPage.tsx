import styles from "./CajeroPage.module.css";
import Table from "../../components/Views/CajeroViews/TableView/Tableview";
import { columns, pedidos } from "../../data/pedidosCajero";

const CajeroPage = () => {
  return (
    <div className={styles.cajeroPage_wrapper}>
      <Table
        columns={columns}
        data={pedidos}
        title="CAJERO"
        itemsPerPage={5}
      />
    </div>
  );
};

export default CajeroPage;
