# UMLs - Centro de Clases Personalizadas

Este paquete contiene los diagramas PlantUML requeridos para el proyecto de **centro de clases personalizadas** con módulos de:

- Personas
- Administración / RRHH
- Servicios educativos
- Programación académica
- Asistencia
- Deuda y pagos
- Pago a tutores
- Contabilidad
- Infraestructura
- Inventario
- Seguridad
- Notificaciones
- Auditoría
- Reportes

## Archivos incluidos

- `activityDiagramMainFlow.puml`
- `caseUseModel.puml`
- `classDiagram.puml`
- `componentDiagram.puml`
- `deployDiagram.puml`
- `deployyDiagram.puml`
- `domainModel.puml`
- `sequenceDiagram.puml`
- `stateDiagram.puml`

## Regla central del dominio

```txt
CLASE VENDIDA != CLASE DICTADA
```

## Cómo renderizar

Puedes renderizar cada archivo con:

```bash
plantuml archivo.puml
```

O usando extensiones de VS Code como **PlantUML**.

## Notas

- `domainModel.puml` representa el modelo conceptual del dominio.
- `classDiagram.puml` profundiza en entidades y atributos principales.
- `deployDiagram.puml` representa el despliegue lógico.
- `deployyDiagram.puml` representa una variante más detallada del despliegue por contenedores.
