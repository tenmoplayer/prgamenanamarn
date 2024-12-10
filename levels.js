/* function checkLevelAccess() {
            // Get the completed level from localStorage (defaults to 0 if not set)
            const completedLevel = parseInt(localStorage.getItem('completedLevel')) || 0;
            
            // Lock levels based on the completed level
            for (let i = 1; i <= 5; i++) {
                const levelButton = document.getElementById(`lvl${i}`);
                if (i > completedLevel + 1) {
                    // Disable the button and add a "locked" class
                    levelButton.classList.add('locked');
                    levelButton.onclick = (e) => e.preventDefault(); // Prevent clicking
                } else {
                    // Enable the button
                    levelButton.classList.remove('locked');
                    levelButton.onclick = () => location.href = `lvl${i}.html`; // Enable navigation
                }
            }
        }

        // Call this function to update button statuses when the page loads
        window.onload = checkLevelAccess; */