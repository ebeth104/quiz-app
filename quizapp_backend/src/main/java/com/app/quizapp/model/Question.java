package com.app.quizapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;

import java.util.List;

@Getter
@Setter
@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String question;
    @NotBlank
    private String category;
    @NotBlank
    private String questionType;

    @ElementCollection
    private List<String> choice;

    @ElementCollection
    private List<String> correctAnswers;

}
