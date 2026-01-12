import ezdxf
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from fpdf import FPDF
import csv
import os

class OptimizadorMecatronicoFinal:
    def __init__(self, ancho_hoja, largo_hoja, kerf, ruta_base):
        self.ancho_hoja = ancho_hoja
        self.largo_hoja = largo_hoja
        self.kerf = kerf
        self.ruta_base = ruta_base
        self.hojas = []
        
        if not os.path.exists(self.ruta_base):
            os.makedirs(self.ruta_base)

    def cargar_desde_csv(self, nombre_archivo):
        ruta_completa_csv = os.path.join(self.ruta_base, nombre_archivo)
        piezas = []
        try:
            with open(ruta_completa_csv, mode='r', encoding='utf-8-sig') as f:
                linea = f.readline()
                sep = ';' if ';' in linea else ','
                f.seek(0)
                
                lector = csv.DictReader(f, delimiter=sep)
                lector.fieldnames = [field.strip().lower() for field in lector.fieldnames]
                
                for fila in lector:
                    piezas.append({
                        'id': int(fila['id']),
                        'w': float(fila['ancho']),
                        'h': float(fila['largo']),
                        'qty': int(fila['cantidad']),
                        'desc': fila['descripcion']
                    })
            print(f"✅ CSV cargado correctamente desde: {ruta_completa_csv}")
            return piezas
        except Exception as e:
            print(f"❌ Error al leer el CSV: {e}")
            return []

    def ejecutar_nesting(self, piezas):
        inventario = []
        for p in piezas:
            for _ in range(p['qty']):
                inventario.append({
                    'id': p['id'],
                    'w': p['w'] + self.kerf,
                    'h': p['h'] + self.kerf,
                    'w_nom': p['w'],
                    'h_nom': p['h']
                })

        inventario.sort(key=lambda x: x['h'], reverse=True)
        hoja_actual = []
        x_cursor, y_cursor, altura_fila = 0, 0, 0

        for p in inventario:
            if x_cursor + p['w'] > self.ancho_hoja:
                x_cursor = 0
                y_cursor += altura_fila
                altura_fila = 0
            if y_cursor + p['h'] > self.largo_hoja:
                self.hojas.append(hoja_actual)
                hoja_actual = []
                x_cursor, y_cursor, altura_fila = 0, 0, 0
            p['x'], p['y'] = x_cursor, y_cursor
            hoja_actual.append(p)
            x_cursor += p['w']
            altura_fila = max(altura_fila, p['h'])
        if hoja_actual: self.hojas.append(hoja_actual)

    def exportar_todo(self):
        pdf = FPDF()
        for i, hoja in enumerate(self.hojas):
            n = i + 1
            dxf_p = os.path.join(self.ruta_base, f"Hoja_{n}.dxf")
            img_p = os.path.join(self.ruta_base, f"vista_{n}.png")
            
            # --- DXF ---
            doc = ezdxf.new('R2010')
            msp = doc.modelspace()
            # Borde material
            msp.add_lwpolyline([(0,0),(self.ancho_hoja,0),(self.ancho_hoja,self.largo_hoja),(0,self.largo_hoja),(0,0)])
            for p in hoja:
                pts = [(p['x'],p['y']),(p['x']+p['w_nom'],p['y']),(p['x']+p['w_nom'],p['y']+p['h_nom']),(p['x'],p['y']+p['h_nom']),(p['x'],p['y'])]
                msp.add_lwpolyline(pts)
            doc.saveas(dxf_p)

            # --- IMAGEN (Validación) ---
            plt.figure(figsize=(6, 8))
            ax = plt.gca()
            ax.set_xlim(0, self.ancho_hoja)
            ax.set_ylim(0, self.largo_hoja)
            for p in hoja:
                rect = patches.Rectangle((p['x'], p['y']), p['w_nom'], p['h_nom'], facecolor='skyblue', edgecolor='darkblue', alpha=0.6)
                ax.add_patch(rect)
                plt.text(p['x']+p['w_nom']/2, p['y']+p['h_nom']/2, str(p['id']), ha='center', va='center', fontsize=8)
            plt.title(f"Plan de Corte - Hoja {n}")
            plt.xlabel("Ancho (mm)")
            plt.ylabel("Largo (mm)")
            plt.savefig(img_p)
            plt.close()

            # --- PDF ---
            pdf.add_page()
            pdf.set_font("Arial", 'B', 14)
            pdf.cell(200, 10, f"Reporte de Corte - Hoja {n}", ln=True, align='C')
            pdf.ln(10)
            pdf.image(img_p, x=25, y=40, w=160)

        pdf_path = os.path.join(self.ruta_base, "Reporte_Final_Router.pdf")
        pdf.output(pdf_path)
        print(f"🚀 Archivos generados en: {self.ruta_base}")

# PARÁMETROS DE CONFIGURACIÓN
# RUTA = r'C:\Users\aleja\Documents\Router CNC\prueba Omar'
RUTA = r'C:\Users\ochav\OneDrive\Documentos\Router CNC\madera-precisa'
CSV_NAME = 'piezas.csv'

# EJECUCIÓN
proceso = OptimizadorMecatronicoFinal(1210, 2430, 12.7, RUTA)
lista_piezas = proceso.cargar_desde_csv(CSV_NAME)
if lista_piezas:
    proceso.ejecutar_nesting(lista_piezas)
    proceso.exportar_todo()