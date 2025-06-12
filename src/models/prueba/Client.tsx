
import Domicilio from "./Domicilio";
import Usuario from "./Usuario"

export default class Cliente{

id:number=0;
nombre:string="";
apellido:string="";
email:string="";
telefono:string="";
fechaDeNacimiento:string="";
domicilio: Domicilio = new Domicilio();
usuario: Usuario = new Usuario();
}