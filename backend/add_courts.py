import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings') # Verifică dacă folderul cu settings se numește 'backend'
django.setup()

from api.models import Club, Court

def populate_courts():
    clubs = Club.objects.all()
    if not clubs.exists():
        print("Nu există cluburi în baza de date!")
        return

    for club in clubs:
        existing_courts_count = Court.objects.filter(club=club).count()
        
        if existing_courts_count >= 3:
            print(f"✅ Clubul '{club.name}' are deja {existing_courts_count} terenuri.")
            continue
            
        needed = 3 - existing_courts_count
        for i in range(needed):
            court_number = existing_courts_count + i + 1
            Court.objects.create(
                club=club,
                name=f"Teren {court_number}",
                price_per_hour=180 
            )
        print(f"🚀 Am adăugat {needed} terenuri pentru '{club.name}'.")

if __name__ == '__main__':
    populate_courts()