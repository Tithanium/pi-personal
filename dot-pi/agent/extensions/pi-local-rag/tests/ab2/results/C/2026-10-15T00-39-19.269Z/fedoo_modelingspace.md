<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 21706 ms retrieval.
## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/modelingspace.py (lines 9-74 · enclosing function/class)

    def __init__(self, dimension, name="Main"):
        """
        Space in which are defined the coordinates and variables (ie functions over coordinates).
        A modeling space is required to be able to define weak equations.

        Parameters
        ----------
        dimension: str in ['2D', '3D', '2Dplane' or '2Dstress']
            Type of modeling space.
            * '2D' or '2Dplane': general 2D problems, with default coordinates 'X' and 'Y' and plane strain assumption
            * '3D' for 3D problems with default coordinates 'X', 'Y' and 'Z'
            * '2Dstress': same as '2D' but using plane stress assumption for mechanical problems
            * '2Daxi': same as '2D' but using axisymmetric assumption for mechanical problems
        name: str, default = 'Main'
            The name of the modeling space

        Example
        --------
        Create a new empty 2D modeling space with plane stress assumption
        >>> import fedoo as fd
        >>> fd.ModelingSpace('2Dstress')
        >>> print(fd.ModelingSpace['Main'].ndim)
        """

        assert isinstance(
            dimension, str
        ), "The dimension value must be a string: '2D', '3D', '2Dplane' or '2Dstress'."
        if dimension == "2D":
            dimension = "2Dplane"
        assert (
            dimension == "3D"
            or dimension == "2Dplane"
            or dimension == "2Dstress"
            or dimension == "2Daxi"
        ), "Dimension must be '2D', '3D', 2Dplane', '2Dstress' or '2Daxi'"

        # Static attributs
        ModelingSpace._active = self
        ModelingSpace.__dic[name] = self

        self.__name = name

        # coordinates
        self._coordinate = {}  # dic containing all the coordinate related to the modeling space
        self._ncrd = 0

        # variables
        self._variable = {}  # attribut statique de la classe
        self._nvar = 0
        self._vector = {}  # dic of vectors containing the variable name
        self._rank_vector = {}  # dict of vectors containing the var rank

        # dimension
        if dimension == "2D":
            dimension = "2Dplane"
        self._dimension = dimension

        self.new_coordinate("X")
        self.new_coordinate("Y")

        if dimension == "3D":
            self.__ndim = 3
            self.new_coordinate("Z")
        if dimension in ["2Dplane", "2Dstress", "2Daxi"]:
            self.__ndim = 2
</rag-context>