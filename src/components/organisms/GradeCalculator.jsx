import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import GradeRing from "@/components/molecules/GradeRing";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const GradeCalculator = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [whatIfScenarios, setWhatIfScenarios] = useState({});

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [courseData, assignmentData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      setCourses(courseData);
      setAssignments(assignmentData);
      if (courseData.length > 0 && !selectedCourse) {
        setSelectedCourse(courseData[0].Id.toString());
      }
    } catch (err) {
      setError("Failed to load grade data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (courses.length === 0) {
    return (
      <Empty
        icon="TrendingUp"
        title="No courses with grades"
        description="Add courses and assignments to start calculating your grades"
        buttonText="View Courses"
        onAction={() => window.location.href = "/courses"}
      />
    );
  }

  const selectedCourseData = courses.find(c => c.Id.toString() === selectedCourse);
  const courseAssignments = assignments.filter(a => a.courseId.toString() === selectedCourse);

  const calculateGradeByCategory = (course, assignments) => {
    const categories = course.gradeCategories || [];
    if (categories.length === 0) return 0;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    categories.forEach(category => {
      const categoryAssignments = assignments.filter(a => 
        a.category === category.name && a.grade !== null && a.grade !== undefined
      );

      if (categoryAssignments.length > 0) {
        const categoryAverage = categoryAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / categoryAssignments.length;
        totalWeightedScore += categoryAverage * (category.weight / 100);
        totalWeight += category.weight / 100;
      }
    });

    return totalWeight > 0 ? totalWeightedScore : 0;
  };

  const calculateOverallGPA = () => {
    if (courses.length === 0) return 0;
    const totalGrade = courses.reduce((sum, course) => {
      const courseAssignments = assignments.filter(a => a.courseId === course.Id);
      const grade = calculateGradeByCategory(course, courseAssignments);
      return sum + (grade * course.credits);
    }, 0);
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    return totalCredits > 0 ? totalGrade / totalCredits : 0;
  };

  const getGradeLetterAndGPA = (percentage) => {
    if (percentage >= 97) return { letter: "A+", gpa: 4.0 };
    if (percentage >= 93) return { letter: "A", gpa: 4.0 };
    if (percentage >= 90) return { letter: "A-", gpa: 3.7 };
    if (percentage >= 87) return { letter: "B+", gpa: 3.3 };
    if (percentage >= 83) return { letter: "B", gpa: 3.0 };
    if (percentage >= 80) return { letter: "B-", gpa: 2.7 };
    if (percentage >= 77) return { letter: "C+", gpa: 2.3 };
    if (percentage >= 73) return { letter: "C", gpa: 2.0 };
    if (percentage >= 70) return { letter: "C-", gpa: 1.7 };
    if (percentage >= 67) return { letter: "D+", gpa: 1.3 };
    if (percentage >= 65) return { letter: "D", gpa: 1.0 };
    return { letter: "F", gpa: 0.0 };
  };

  const handleWhatIfChange = (categoryName, newGrade) => {
    setWhatIfScenarios({
      ...whatIfScenarios,
      [categoryName]: parseFloat(newGrade) || 0
    });
  };

  const calculateWhatIfGrade = () => {
    if (!selectedCourseData) return 0;
    
    const categories = selectedCourseData.gradeCategories || [];
    let totalWeightedScore = 0;
    let totalWeight = 0;

    categories.forEach(category => {
      const categoryAssignments = courseAssignments.filter(a => a.category === category.name && a.grade !== null);
      let categoryAverage;

      if (whatIfScenarios[category.name] !== undefined) {
        // Use what-if scenario grade
        categoryAverage = whatIfScenarios[category.name];
      } else if (categoryAssignments.length > 0) {
        // Use actual grades
        categoryAverage = categoryAssignments.reduce((sum, a) => sum + a.grade, 0) / categoryAssignments.length;
      } else {
        // No grades yet
        categoryAverage = 0;
      }

      totalWeightedScore += categoryAverage * (category.weight / 100);
      totalWeight += category.weight / 100;
    });

    return totalWeight > 0 ? totalWeightedScore : 0;
  };

  const currentGrade = selectedCourseData ? calculateGradeByCategory(selectedCourseData, courseAssignments) : 0;
  const whatIfGrade = calculateWhatIfGrade();
  const overallGPA = calculateOverallGPA();
  const currentGradeInfo = getGradeLetterAndGPA(currentGrade);
  const whatIfGradeInfo = getGradeLetterAndGPA(whatIfGrade);

  return (
    <div className="space-y-6">
      {/* Overall GPA Card */}
      <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
        <CardHeader>
          <CardTitle className="text-center">Overall Academic Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <GradeRing percentage={overallGPA * 25} size={100} strokeWidth={8} />
              <p className="text-2xl font-bold text-gray-900 mt-2">{overallGPA.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Current GPA</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">{getGradeLetterAndGPA(overallGPA * 25).letter}</div>
              <p className="text-sm text-gray-600 mt-1">Letter Grade</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{courses.reduce((sum, c) => sum + c.credits, 0)}</div>
              <p className="text-sm text-gray-600">Total Credits</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Course Grade Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="max-w-md"
            >
              {courses.map((course) => (
                <option key={course.Id} value={course.Id.toString()}>
                  {course.name} - {course.semester}
                </option>
              ))}
            </Select>
          </div>

          {selectedCourseData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Grade */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ApperIcon name="BarChart3" className="h-5 w-5 text-primary-500" />
                  Current Grade
                </h3>
                
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center">
                  <GradeRing percentage={currentGrade} size={120} strokeWidth={10} />
                  <div className="mt-4 space-y-2">
                    <div className="text-3xl font-bold text-gray-900">{currentGrade.toFixed(1)}%</div>
                    <div className="flex items-center justify-center space-x-4">
                      <Badge variant="primary" className="text-lg px-4 py-2">
                        {currentGradeInfo.letter}
                      </Badge>
                      <span className="text-gray-600">{currentGradeInfo.gpa} GPA</span>
                    </div>
                  </div>
                </div>

                {/* Grade Categories */}
                <div className="mt-6 space-y-3">
                  {selectedCourseData.gradeCategories?.map((category) => {
                    const categoryAssignments = courseAssignments.filter(a => a.category === category.name && a.grade !== null);
                    const categoryAverage = categoryAssignments.length > 0 
                      ? categoryAssignments.reduce((sum, a) => sum + a.grade, 0) / categoryAssignments.length
                      : 0;

                    return (
                      <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{category.name}</h4>
                          <p className="text-sm text-gray-600">{category.weight}% of final grade</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">{categoryAverage.toFixed(1)}%</div>
                          <div className="text-sm text-gray-600">{categoryAssignments.length} assignments</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* What-If Calculator */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ApperIcon name="Calculator" className="h-5 w-5 text-secondary-500" />
                  What-If Calculator
                </h3>

                <div className="bg-gradient-to-br from-secondary-50 to-cyan-50 rounded-xl border-2 border-secondary-200 p-6 text-center">
                  <GradeRing percentage={whatIfGrade} size={120} strokeWidth={10} />
                  <div className="mt-4 space-y-2">
                    <div className="text-3xl font-bold text-gray-900">{whatIfGrade.toFixed(1)}%</div>
                    <div className="flex items-center justify-center space-x-4">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {whatIfGradeInfo.letter}
                      </Badge>
                      <span className="text-gray-600">{whatIfGradeInfo.gpa} GPA</span>
                    </div>
                    {Math.abs(whatIfGrade - currentGrade) > 0.1 && (
                      <div className={`text-sm font-medium ${whatIfGrade > currentGrade ? 'text-green-600' : 'text-red-600'}`}>
                        {whatIfGrade > currentGrade ? '+' : ''}{(whatIfGrade - currentGrade).toFixed(1)} points
                      </div>
                    )}
                  </div>
                </div>

                {/* What-If Inputs */}
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium text-gray-900">Try different grades:</h4>
                  {selectedCourseData.gradeCategories?.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">{category.name} ({category.weight}%)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder={`Enter grade for ${category.name}`}
                        value={whatIfScenarios[category.name] || ""}
                        onChange={(e) => handleWhatIfChange(category.name, e.target.value)}
                        className="w-full"
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setWhatIfScenarios({})}
                    className="w-full mt-4"
                  >
                    <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
                    Reset What-If
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Courses Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All Courses Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
              const courseAssignments = assignments.filter(a => a.courseId === course.Id);
              const courseGrade = calculateGradeByCategory(course, courseAssignments);
              const gradeInfo = getGradeLetterAndGPA(courseGrade);

              return (
                <div
                  key={course.Id}
                  className="p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-colors"
                  style={{ borderLeftColor: course.color, borderLeftWidth: "4px" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{course.name}</h4>
                      <p className="text-sm text-gray-600">{course.credits} credits</p>
                    </div>
                    <GradeRing percentage={courseGrade} size={50} strokeWidth={4} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-900">{courseGrade.toFixed(1)}%</div>
                    <Badge variant="default">{gradeInfo.letter}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeCalculator;