document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.style.boxShadow = '0 4px 20px -5px rgba(0,0,0,0.1)';
            navbar.style.padding = '0.75rem 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1.25rem 0';
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Icon Toggle
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    /* --- Quiz Logic --- */
    const quizData = [
        {
            question: "Bagaimana kualitas tidur Anda belakangan ini?",
            options: [
                { text: "Sangat nyenyak & teratur", score: 0 },
                { text: "Kadang terbangun malam hari", score: 1 },
                { text: "Sulit tidur / Insomnia", score: 2 }
            ]
        },
        {
            question: "Seberapa sering Anda merasa cemas tanpa alasan jelas?",
            options: [
                { text: "Jarang sekali", score: 0 },
                { text: "Kadang-kadang", score: 1 },
                { text: "Hampir setiap hari", score: 2 }
            ]
        },
        {
            question: "Apakah Anda masih bisa menikmati hobi atau aktivitas favorit?",
            options: [
                { text: "Ya, sangat menikmati", score: 0 },
                { text: "Kurang bersemangat", score: 1 },
                { text: "Tidak ada minat sama sekali", score: 2 }
            ]
        },
        {
            question: "Bagaimana tingkat fokus Anda saat bekerja/belajar?",
            options: [
                { text: "Fokus terjaga baik", score: 0 },
                { text: "Mudah terdistraksi", score: 1 },
                { text: "Sulit berkonsentrasi penuh", score: 2 }
            ]
        },
        {
            question: "Seberapa sering Anda merasa ingin menyendiri dan menghindari orang lain?",
            options: [
                { text: "Jarang, saya suka bersosialisasi", score: 0 },
                { text: "Sesekali butuh waktu sendiri", score: 1 },
                { text: "Sering, saya merasa lelah bertemu orang", score: 2 }
            ]
        },
        {
            question: "Apakah Anda mudah merasa tersinggung atau marah akhir-akhir ini?",
            options: [
                { text: "Tidak, emosi saya stabil", score: 0 },
                { text: "Sedikit lebih sensitif dari biasanya", score: 1 },
                { text: "Ya, hal kecil bisa membuat saya meledak", score: 2 }
            ]
        },
        {
            question: "Bagaimana pandangan Anda terhadap masa depan?",
            options: [
                { text: "Optimis dan bersemangat", score: 0 },
                { text: "Ragu-ragu / Bingung", score: 1 },
                { text: "Pessimis / Tidak ada harapan", score: 2 }
            ]
        },
        {
            question: "Apakah Anda merasakan gejala fisik seperti dada sesak atau jantung berdebar?",
            options: [
                { text: "Tidak pernah", score: 0 },
                { text: "Jarang, hanya saat stres berat", score: 1 },
                { text: "Sering, meski sedang santai", score: 2 }
            ]
        }
    ];

    let currentQuestion = 0;
    let totalScore = 0;

    // Expose functions to window (global scope) for HTML events
    window.startQuiz = () => {
        document.getElementById('quiz-start').style.display = 'none';
        document.getElementById('quiz-question').style.display = 'block';
        loadQuestion();
    };

    window.resetQuiz = () => {
        currentQuestion = 0;
        totalScore = 0;
        document.getElementById('quiz-result').style.display = 'none';
        document.getElementById('quiz-start').style.display = 'block';
    };

    const loadQuestion = () => {
        const questionData = quizData[currentQuestion];
        document.getElementById('question-text').innerText = questionData.question;
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        // Update progress bar
        const progress = ((currentQuestion) / quizData.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;

        questionData.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            btn.innerText = opt.text;
            btn.onclick = () => selectOption(opt.score);
            optionsContainer.appendChild(btn);
        });
    };

    const selectOption = (score) => {
        totalScore += score;
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    };

    const showResult = () => {
        document.getElementById('quiz-question').style.display = 'none';
        const resultScreen = document.getElementById('quiz-result');
        resultScreen.style.display = 'block';
        // 100% progress
        document.getElementById('progress-fill').style.width = '100%';

        const rTitle = document.getElementById('result-title');
        const rDesc = document.getElementById('result-desc');
        const rIcon = document.getElementById('result-icon');

        // Adjusted logic for 8 questions (Max Score 16)
        if (totalScore <= 5) {
            rTitle.innerText = "Kondisi Mental Anda Stabil";
            rDesc.innerText = "Anda memiliki manajemen stres yang baik. Pertahankan pola hidup sehat Anda! Tetap luangkan waktu untuk relaksasi.";
            rIcon.innerHTML = '<i class="fas fa-smile-beam text-sage"></i>';
        } else if (totalScore <= 10) {
            rTitle.innerText = "Sedikit Tertekan";
            rDesc.innerText = "Anda mungkin sedang mengalami stres ringan hingga sedang. Cobalah istirahat sejenak, lakukan hobi, atau meditasi.";
            rIcon.innerHTML = '<i class="fas fa-meh text-gold"></i>';
        } else {
            rTitle.innerText = "Perlu Perhatian Khusus";
            rDesc.innerText = "Skor Anda mengindikasikan tingkat stres atau kecemasan yang cukup tinggi. Jangan ragu untuk mencari bantuan profesional.";
            rIcon.innerHTML = '<i class="fas fa-frown-open" style="color: #e74c3c;"></i>';
        }
    };

});
