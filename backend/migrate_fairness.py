from database import engine, Base
from models import FairnessAuditLog

def migrate():
    print("Creating fairness_audit_logs table...")
    Base.metadata.create_all(bind=engine, tables=[FairnessAuditLog.__table__])
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
