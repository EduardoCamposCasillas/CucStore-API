import { Request, Response } from 'express'
import * as BD from './../../helpers/bdActions'
import { Producto } from '../../models/TProductos.model'
import { Usuario } from '../../models/TUsuarios.model'
export function deleteUserProductById (req: Request, res: Response): void {
  const { idUsuario } = req.body
  const { productId } = req.params;

  (async () => {
    try {
      await BD.connectBD()
      await Usuario.updateOne({ _id: idUsuario }, { $pull: { productos: productId } })
      const productoEliminado = await Producto.findByIdAndDelete({ _id: productId })
      await BD.disconnectBD()

      if (productoEliminado === null) {
        res.status(404).json({ mensaje: 'Producto no encontrado' })
        return
      }

      res.status(204).json({ mensaje: 'Eliminado con exito' })
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error })
    }
  })().catch(error => res.status(500).json({ mensaje: 'Error en el servidor', error }))
}
